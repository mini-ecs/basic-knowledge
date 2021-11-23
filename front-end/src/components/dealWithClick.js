import React from "react";
import {Button} from "antd";
import "./dealWithClick.css"

class DealClick extends React.Component {
    render() {
        return (
            <div>
            <Button type="default" onClick={this.handleClock}> 这是一个button </Button>
            <Button type="primary" onClick={this.handleClock}> 这是一个button </Button>
            <Button type="link" onClick={this.handleClock}> 这是一个button </Button>
            <Button type="text" onClick={this.handleClock}> 这是一个button </Button>
            <Button type="ghost" onClick={this.handleClock}> 这是一个button </Button>
            <Button type="dashed" onClick={this.handleClock}> 这是一个button </Button>

            </div>
        )
    }
    handleClock = ()=>{
        console.log("button 被点了")
    }
}

export default DealClick