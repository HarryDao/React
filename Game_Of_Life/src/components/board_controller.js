import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';


class BoardController extends Component {
    
    constructor(props){
        super(props);
        this.state = {running: false};

        this.onStartClick = this.onStartClick.bind(this);
        this.onStopClick = this.onStopClick.bind(this);
        this.onNewGameClick = this.onNewGameClick.bind(this);
        this.onGoToInputChange = this.onGoToInputChange.bind(this);
        this.goToNextState = this.goToNextState.bind(this);
    }

    componentWillUpdate(newProps){
        if (newProps.size !== this.props.size){
            this.onStopClick();
        }
    }

    goToNextState(cb){
        const {steps, stepView, createNextState} = this.props;

        createNextState(steps[stepView]);

        if (cb && typeof cb === 'function'){
            return cb();
        }
    }

    onStartClick(){
        const $ = this;

        function run (){
            if ($.props.interval){
                setTimeout(()=>{
                    if ($.state.running){
                        $.goToNextState(run);
                    }
                }, $.props.interval);
            }
        }

        this.setState({running: true}, run);

    }

    onStopClick(){
        this.setState({running: false});
    }

    onResetClick(){
        this.onStopClick();
        this.props.goToStep(0);
    }

    onGoToInputChange(e){
        const index = e.target.value - 1;
        if (this.props.steps[index]){
            this.onStopClick();
            this.props.goToStep(index);
        }
    }

    onNewGameClick(){
        this.onStopClick();
        this.props.createNewBoard(this.props.size);
    }

    renderStepController(){
        const {steps} = this.props
        if (steps && steps.length > 0){
            return(
                <div className="steps">
                    <p className="total">Total steps: <span>{this.props.steps.length}</span></p>
                    <p className="current">Current step: <span>{this.props.stepView + 1}</span></p>
                    <div className="goto">
                        <span>Go to step:</span>
                        <input
                            placeholder = 'i.e 3'
                            type = 'number'
                            onChange = {this.onGoToInputChange}
                        />
                    </div>
                </div>
            );
        }
    }

    render(){
        return(
            <div className="board-controller">
                <div className="buttons">
                
                    <button
                        className={this.state.running ? '' : 'highlighted'}
                        onClick = {this.onStartClick}
                    >Start</button>

                    <button
                        className={this.state.running ? 'highlighted' : ''}
                        onClick = {this.onStopClick}
                    >Stop</button>

                    <button
                        className="new"
                        onClick = {this.onNewGameClick}
                    >New Game</button>

                </div>
                {this.renderStepController()}
            </div>
        );
    }
}

function mapStateToProps({ board }){

    const { steps, stepView, interval, size } = board;

    return { steps, stepView, interval, size }
}

export default connect(mapStateToProps, actions)(BoardController);