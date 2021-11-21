# 前置准备

## 在Mac OS上使用ubuntu虚拟机

Parallel Desktop 太贵，Vmware、Virtual Box 又不支持 Arm64，因此开始找一个平价（免费）的替代方案：Multipass，健康又美味~

在[官方网站上](https://multipass.run/docs/installing-on-macos)按照指引安装 multipass，不需要使用 virtual box。

在安装完成后，我当时开着 vpn，因此在下载软件的时候、上网的时候，死活访问不了外网。经排查，发现 vpn 将流量全部转发到本地端口，导致无法使用。在关闭 vpn 后，可以正常使用。

一开始想要切换到国内的镜像源，但是换了阿里源和中科大源，发现 apt 都下载不了软件。最后重新换回原来的配置文件，可以使用，速度也不慢。



## 安装 QEMU

使用 apt 安装，缺啥补啥。比如要使用 `qemu-img` 的时候，会提示安装 `qemu-utils`:

```shell
ubuntu@foo:~$ qemu-img
Command 'qemu-img' not found, but can be installed with:
sudo apt install qemu-utils
```

然后用 `sudo apt install qemu-utils`安装。



## 创建磁盘

```shell
ubuntu@foo:~$ qemu-img create -f raw debian.img 10G
Formatting 'debian.img', fmt=raw size=10737418240

ubuntu@foo:~$ qemu-img info debian.img
image: debian.img
file format: raw
virtual size: 10 GiB (10737418240 bytes)
disk size: 4 KiB
```

`create -f`是指定磁盘介质的格式。介质有如下几种：

- raw: 特点是没有特点，使其性能比较好
- qcow2：支持虚拟机的快照、压缩、加密，性能劣于 raw
- qcow：前一代的qcow2
- dmg：用于mac os的镜像文件
- nbd：network block device，网络块设备，用于访问远程的存储设备
- vmdk：vmware的镜像格式
- vhdx：微软hyper-V的镜像格式



## 格式化创建的磁盘

```shell
ubuntu@foo:~$ sudo modprobe nbd
```

安装 nbd 内核模块。

```shell
ubuntu@foo:~$ sudo qemu-nbd --format=raw --connect=/dev/nbd0 debian.img
```

使用 qemu-nbd 工具将刚刚创建的空镜像文件关联到 /dev/nbd0 块设备

```shell
ubuntu@foo:~$ sudo sfdisk /dev/nbd0 << EOF
,1024,82
;
EOF
Checking that no-one is using this disk right now ... OK

Disk /dev/nbd0: 10 GiB, 10737418240 bytes, 20971520 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes

>>> Created a new DOS disklabel with disk identifier 0x574cdd67.
/dev/nbd0p1: Created a new partition 1 of type 'Linux swap / Solaris' and of size 512 KiB.
/dev/nbd0p2: Created a new partition 2 of type 'Linux' and of size 10 GiB.
/dev/nbd0p3: Done.

New situation:
Disklabel type: dos
Disk identifier: 0x574cdd67

Device      Boot Start      End  Sectors  Size Id Type
/dev/nbd0p1       2048     3071     1024  512K 82 Linux swap / Solaris
/dev/nbd0p2       4096 20971519 20967424   10G 83 Linux

The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

给磁盘划分区，一个是swap区，一个是root区。

```shell
ubuntu@foo:~$ ls -la /dev/nbd0*
brw-rw---- 1 root disk 43, 0 Nov 21 11:01 /dev/nbd0
brw-rw---- 1 root disk 43, 1 Nov 21 11:01 /dev/nbd0p1
brw-rw---- 1 root disk 43, 2 Nov 21 11:01 /dev/nbd0p2
```

下面使能这两个分区：

```shell
ubuntu@foo:~$ sudo mkswap /dev/nbd0p1
Setting up swapspace version 1, size = 508 KiB (520192 bytes)
no label, UUID=0fcb56ab-9a98-4c7e-9fae-2791c07beea2

ubuntu@foo:~$ sudo mkfs.ext4 /dev/nbd0p2
mke2fs 1.45.5 (07-Jan-2020)
Discarding device blocks: failed - Input/output error
Creating filesystem with 2620928 4k blocks and 655360 inodes
Filesystem UUID: be19b111-c24f-45eb-a828-cb14d780754d
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632

Allocating group tables: done
Writing inode tables: done
Creating journal (16384 blocks): done
Writing superblocks and filesystem accounting information: done
```





## 安装操作系统

debootstrap是一个构建根文件系统的工具。首先安装该工具：

```shell
ubuntu@foo:~$ sudo apt install debootstrap
Reading package lists... Done
Building dependency tree
Reading state information... Done
```

将上一步中格式化完毕的文件系统挂载到 /mnt

```shell
ubuntu@foo:~$ sudo mount /dev/nbd0p2 /mnt/

ubuntu@foo:~$ ls /mnt
lost+found

ubuntu@foo:~$ mount | grep mnt
nsfs on /run/snapd/ns/lxd.mnt type nsfs (rw)
/dev/nbd0p2 on /mnt type ext4 (rw,relatime)
```



使用 debootstrap 安装根文件系统

```shell
ubuntu@foo:~$ sudo debootstrap --arch=amd64 --include="openssh-server vim" stable /mnt/ http://httpredir.debian.org/debian/
W: Cannot check Release signature; keyring file not available /usr/share/keyrings/debian-archive-keyring.gpg
I: Validating Packages
I: Resolving dependencies of required packages...
I: Resolving dependencies of base packages...
```



查看结果

```shell
ubuntu@foo:~$ ls -lah /mnt
total 72K
drwxr-xr-x 15 root root 4.0K Nov 21 12:21 .
drwxr-xr-x 19 root root 4.0K Nov 21 09:58 ..
lrwxrwxrwx  1 root root    7 Nov 21 12:19 bin -> usr/bin
drwxr-xr-x  2 root root 4.0K Oct  3 17:15 boot
drwxr-xr-x  2 root root 4.0K Nov 21 12:19 debootstrap
drwxr-xr-x  4 root root 4.0K Nov 21 12:19 dev
drwxr-xr-x 29 root root 4.0K Nov 21 12:19 etc
drwxr-xr-x  2 root root 4.0K Oct  3 17:15 home
lrwxrwxrwx  1 root root    7 Nov 21 12:19 lib -> usr/lib
lrwxrwxrwx  1 root root    9 Nov 21 12:19 lib32 -> usr/lib32
lrwxrwxrwx  1 root root    9 Nov 21 12:19 lib64 -> usr/lib64
lrwxrwxrwx  1 root root   10 Nov 21 12:19 libx32 -> usr/libx32
drwx------  2 root root  16K Nov 21 11:03 lost+found
drwxr-xr-x  2 root root 4.0K Oct  3 17:15 proc
drwx------  2 root root 4.0K Oct  3 17:15 root
drwxr-xr-x  2 root root 4.0K Oct  3 17:15 run
lrwxrwxrwx  1 root root    8 Nov 21 12:19 sbin -> usr/sbin
drwxr-xr-x  2 root root 4.0K Oct  3 17:15 sys
drwxrwxrwt  2 root root 4.0K Oct  3 17:15 tmp
drwxr-xr-x 13 root root 4.0K Nov 21 12:19 usr
drwxr-xr-x 11 root root 4.0K Nov 21 12:19 var
```



将宿主机的设备目录绑定到镜像的文件系统

```shell
ubuntu@foo:~$ sudo mount --bind /dev/ /mnt/dev

ubuntu@foo:~$ ls -la /mnt/dev/ | grep nbd0
brw-rw----  1 root disk     43,   0 Nov 21 11:01 nbd0
brw-rw----  1 root disk     43,   1 Nov 21 11:03 nbd0p1
brw-rw----  1 root disk     43,   2 Nov 21 11:03 nbd0p2
```

