import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Hello from './components/hello';
import DealClick from './components/dealWithClick'
import MyStateCom from './components/useStateComponent';
import ControlComponent from './components/controlComponent';

const songs = [
  { id: 1, name: "Love Story" },
  { id: 2, name: "Special Diet" },
  { id: 3, name: "Forever young" }
]


let listParse = () => <ul>
  {songs.map(
    item => <li key={item.id}> {item.name} </li>
  )}
</ul>


let showDate = () => {
  return <div className="list">
    {new Date().toLocaleTimeString()}
  </div>
}
class MyClassElement extends React.Component {
  render() {
    return <div>It's a class element. </div>
  }
}


let Root = () => {
  return <div>
    <h1 className="list">列表渲染示例</h1>
    {listParse()}
    <h1>时间刷新示例</h1>
    {showDate()}
    <h1>类组件示例</h1>
    <MyClassElement />
    <h1>单独文件里的类组件示例</h1>
    <Hello/>
    <h1>React 事件处理</h1>
    <DealClick/>
    <h1>有状态组件</h1>
    <MyStateCom/>
    <h1>受控组件</h1>
    <ControlComponent/>
  </div>
}


// current: https://www.bilibili.com/video/BV14y4y1g7M4?p=29&spm_id_from=pageDriver

setInterval(() => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root')
  );
}, 1000);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
