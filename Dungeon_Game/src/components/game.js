import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import GameInfo from './game_info';
import GameBoard from './game_board';
import GameResult from './game_result';


class Game extends Component {
    constructor(props){
        super(props);
        this.onUserInput = this.onUserInput.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onUserInput, false);
    }

    onUserInput(e){
        const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        const {board, player, movePlayer} = this.props;

        if (player && player.outcome){
            return;
        }
        
        if (board && player && e && e.key && keys.indexOf(e.key) > -1){
            movePlayer(e.key, board, player, this.renderBoard);
        }
    }

    render() {
        return(
            <div className='game'>
                <GameResult />
                <GameInfo />
                <GameBoard />
            </div>            
        );
    }
}

function mapStateToProps({game}){
    return {
        board: game.board,
        player: game.player,
    }
}

export default connect(mapStateToProps, actions)(Game);