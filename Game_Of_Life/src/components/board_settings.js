import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import { SIZE_OPTIONS, INTERVAL_TIME_OPTIONS } from '../configs';


class BoardSettings extends Component {
    constructor (props) {
        super(props);
        
        SIZE_OPTIONS.options = SIZE_OPTIONS.options.map((option)=>{
            option.name = `Size: ${option.col}X${option.row}`;
            return option;
        });

        this.state = {
            size: SIZE_OPTIONS,
            interval: INTERVAL_TIME_OPTIONS
        }

        this.renderSetting = this.renderSetting.bind(this);
        this.renderSizes = this.renderSizes.bind(this);
        this.renderIntervalTimes = this.renderIntervalTimes.bind(this);
        this.onSizeClick = this.onSizeClick.bind(this);
        this.onIntervalClick = this.onIntervalClick.bind(this);
    }
    
    componentDidMount(){
        this.state.interval.options.map((option)=>{
            if (option.choosed){
                this.props.setTimeInterval(option);
            }
        })
        this.state.size.options.map((option)=>{
            if (option.choosed){
                this.props.createNewBoard(option);
            }
        });
    }

    onSizeClick(optionName){
        const currentSetting = JSON.parse(JSON.stringify(this.state.size));
        
        const {newSetting, choosedOption} = this.onSettingClick(currentSetting, optionName);

        if (choosedOption){
            this.props.createNewBoard(choosedOption);
            this.setState({size: newSetting});
            this.renderSizes();
        }
    }

    onIntervalClick(optionName){
        const currentSetting = JSON.parse(JSON.stringify(this.state.interval));
        const {newSetting, choosedOption} = this.onSettingClick(currentSetting, optionName);

        if (choosedOption){
            this.props.setTimeInterval(choosedOption);
            this.setState({interval: newSetting});
            this.renderIntervalTimes();
        }
    }

    onSettingClick(setting, optionName){
        let choosedOption = null;

        setting.options = setting.options.map((option)=>{
            if (option.name == optionName){
                if (option.choosed != true){
                    choosedOption = option;
                }
                option.choosed = true;
            }
            else {
                option.choosed = false;
            }
            return option;
        });
        return {
            newSetting: setting,
            choosedOption
        }
    }


    renderSizes(){
        const {name, options} = this.state.size;
        const onClick = (optionName)=>{
            this.onSizeClick(optionName);
        }
        return this.renderSetting(name, options, onClick);
    }

    renderIntervalTimes(){
        const {name, options} = this.state.interval;
        const onClick = (optionName)=>{
            this.onIntervalClick(optionName);
        }
        return this.renderSetting(name, options, onClick);
    }

    renderSetting (name , options, onClick) {
        options = options.map((option, index)=>{
            return (
                <td className="option" key={`option-${name}-${index}`}>
                    <button 
                        className={option.choosed ? 'active' : ''}
                        onClick = {() => onClick(option.name)}
                    >{option.name}</button>
                </td>
            );
        });

        return(
            <tr>
                <td className="name">{name}</td>
                {options}
            </tr>
        );
    }


    render(){
        return(
            <div className="board-settings">
                <table>
                    <tbody>
                        {this.renderSizes()}
                        {this.renderIntervalTimes()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(null, actions)(BoardSettings);