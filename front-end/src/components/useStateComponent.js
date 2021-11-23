import React from "react";

class MyStateCom extends React.Component{
    constructor(){
        super()

        this.state = {
            count: 0
        }
    }

    onIncrement(){
        this.setState(
            {
                count: this.state.count+1
            }
        )
    }

    anotherIncrement = () => {
        this.setState(
            {
                count: this.state.count+1
            }
        )
    }

    render(){
        // 把js代码从jsx中抽离出来
        return (
            <div>
                计数器: {this.state.count}, 
                <button onClick={()=>this.onIncrement()}>点击按钮+1, 用()=>解决this问题</button>,
                <button onClick={this.anotherIncrement}>点击按钮+1, 用class的实例方法解决this问题</button>

            </div>
        )
    }
}

export default MyStateCom