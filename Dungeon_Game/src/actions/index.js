import {
    CREATE_NEW_BOARD,
    INITIATE_PLAYER,
    INITIATE_PLAYER_POSITION_ON_NEXT_STAGE,
    MOVE_PLAYER,
    END_GAME,
    TOGGLE_DARKNESS
} from './types';
import {GAME} from '../configs/game_config';
import BoardHelper from '../helpers/board_helper';
import PlayerHelper from '../helpers/player_helper';

const {GAME_INITIAL_LEVEL} = GAME;


export function createNewBoard(gameLevel = GAME_INITIAL_LEVEL, cb){
    return (dispatch)=>{
        const board = BoardHelper.CreateNewBoard(gameLevel);
        const move = 0;
        dispatch({
            type: CREATE_NEW_BOARD,
            payload: {board, gameLevel}
        });

        if (gameLevel <= GAME_INITIAL_LEVEL){
            const player = PlayerHelper.Initiate(board);
            dispatch({
                type: INITIATE_PLAYER,
                payload: player
            });
        }
        else {
            const position = PlayerHelper.Initiate(board, true);
            dispatch({
                type: INITIATE_PLAYER_POSITION_ON_NEXT_STAGE,
                payload: position
            })
        }

    }
}


export function movePlayer(keypress, board, player, cb){
    return (dispatch)=>{
        
        ({player, board} = PlayerHelper.MovePlayer(keypress, board, player));

        if (player && board){
            dispatch({
                type: MOVE_PLAYER,
                payload: {player, board},
            });

            if (cb && typeof cb === 'function'){
                return cb();
            }
        }
    }
}

export function endGame(health, boss){

    const playerCanLose = !health || health < 1;
    const playerCanWin = boss && boss.boss && !boss.enemy;

    let result = null;
    if (playerCanLose && !playerCanWin){
        result = 'lose'
    }
    else if (!playerCanLose && playerCanWin){
        result = 'win'
    }
    else if (playerCanLose && playerCanWin){
        result = 'draw'
    }

    return {
        type: END_GAME,
        payload: result
    }
}

export function toggleDarkness(){
    return {type: TOGGLE_DARKNESS}
}