# 前置准备

## 在Mac os上使用ubuntu虚拟机

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