import {
    CREATE_NEW_BOARD,
    INITIATE_PLAYER,
    INITIATE_PLAYER_POSITION_ON_NEXT_STAGE,
    MOVE_PLAYER,
    END_GAME,
    TOGGLE_DARKNESS
} from '../actions/types';

export default function(state = {}, action){
    switch(action.type){
        case CREATE_NEW_BOARD:
            return {
                ...state, 
                board: action.payload.board, 
                gameLevel: action.payload.gameLevel, 
                darkness: true
            };
        case INITIATE_PLAYER:
            return {
                ...state, 
                player: action.payload
            }
        case INITIATE_PLAYER_POSITION_ON_NEXT_STAGE:
            const newPlayer = {...state.player, position: action.payload};
            return {
                ...state, 
                player: newPlayer
            }
        case MOVE_PLAYER:
            return {...state, player: action.payload.player, board: action.payload.board};
        case TOGGLE_DARKNESS:
            return {...state, darkness: !state.darkness}
        default:
            return state
    }
}