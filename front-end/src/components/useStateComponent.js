import React from "react";

class MyStateCom extends React.Component{
    constructor(){
        super()

        this.state = {
            count: 0
        }
    }

    render(){
        return (
            <div>
                计数器: {this.state.count}, 
                <button onClick={ 
                    ()=>{
                        this.setState(
                            {
                                count: this.state.count+1
                            }
                        )
                    }
                }>点击按钮+1</button>
            </div>
        )
    }
}

export default MyStateCom