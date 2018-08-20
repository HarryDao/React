import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Fade} from '../styles/style-helper';

class GameResult extends Component {
    constructor(props){
        super(props);
        this.state = {message: null, outcome: null};

        this.onOutcomeAvailable = this.onOutcomeAvailable.bind(this);

    }

    componentDidUpdate(){
        const {player} = this.props;
        if (player && player.outcome && this.state.message === null){
            this.onOutcomeAvailable(player.outcome);
        }
    }

    onOutcomeAvailable(outcome){
        if (!outcome){
            return;
        }
        let message = this.state.message;
        switch(outcome){
            case 'win':
                message = 'Congratulation! You won!';
                break;
            case 'lose':
                message = 'Sorry! You lose!';
                break;
            case 'draw':
                message = 'That is a tough fight! It is a draw';
                break;
        }

        if (message !== this.state.message){
            this.setState({message, outcome});
        }
        
    }
    render(){
        const {message, outcome} = this.state;
        
        return Fade(
            {in: message ? true: false}, 
            (style) => {  
                const className = `inner ${outcome}`;
                return (
                    <div className='game-result' style={style}>
                        <div className={className}>
                            <h3>{message}</h3>
                        </div>                     
                    </div>
                );
            }
        );
    }
}

function mapStateToProps({game}){
    return {
        player: game.player
    }
}

export default connect(mapStateToProps)(GameResult);