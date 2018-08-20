import {
    BOARD_NEW,
    BOARD_UPDATE,
    BOARD_GOTO,
    BOARD_SET_TIME_INTERVAL,
} from '../actions/types';

export default function(state = {}, action){
    switch(action.type){
        case BOARD_NEW:
            const {board, size} = action.payload;
            return {...state, steps: [board], size, stepView: 0}

        case BOARD_UPDATE:
            const currentSteps = state.steps.slice(0, state.stepView + 1);
            const newSteps = [...currentSteps, action.payload];

            return {...state, steps: newSteps, stepView: newSteps.length - 1};

        case BOARD_GOTO:
            return {...state, stepView: action.payload};

        case BOARD_SET_TIME_INTERVAL:
            return {...state, interval: action.payload};
            
        default:
            return state;
    }
}