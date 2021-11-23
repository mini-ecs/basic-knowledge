import React from "react";

class ControlComponent extends React.Component {
    constructor() {
        super()
        this.state = {
            txt: "fuck",
            city: "bj",
            isChecked: false,
        }
    }

    dealWithGeneralWay = (e) => {
        // 获取当前dom对象
        const target = e.target;
        const value = target.type === 'checkbox'
        ? target.checked
        : target.value;

        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    render() {
        return <div>
            <input name="txt" type="text" value={this.state.txt} onChange={this.dealWithGeneralWay} />
            <br/>
            <select name="city" value={this.state.city} onChange={this.dealWithGeneralWay}>
                <option value="sh">上海</option>
                <option value="bj">北京</option>
                <option value="lz">兰州</option>
                <option value="zj">浙江</option>
            </select>
            <br/>
            <input name="isChecked" type="checkbox" checked={this.state.isChecked} onChange={this.dealWithGeneralWay}/>
        </div>
    }
}

export default ControlComponent