import {
    BOARD_NEW,
    BOARD_UPDATE,
    BOARD_GOTO,
    BOARD_SET_TIME_INTERVAL,
} from './types';
import BoardHelper from '../helpers/board_helper';

export function createNewBoard({row, col}){
    return {
        type: BOARD_NEW,
        payload: {
            board: BoardHelper.GenerateNewBoard(row, col),
            size: {row, col}
        }
    }
}

export function createNextState(current){
    return {
        type: BOARD_UPDATE,
        payload: BoardHelper.GenerateNextState(current)
    }
}

export function goToStep(stepIndex){
    return {
        type: BOARD_GOTO,
        payload: stepIndex
    }
}

export function setTimeInterval({time}){
    return {
        type: BOARD_SET_TIME_INTERVAL,
        payload: time
    }
}
