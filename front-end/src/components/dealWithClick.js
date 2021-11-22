import React from "react";

class DealClick extends React.Component {
    render() {
        return (
            <button onClick={this.handleClock}> 这是一个button </button>
        )
    }
    handleClock() {
        console.log("button 被点了")
    }
}

export default DealClick