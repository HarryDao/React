export default function({dispatch}){
    return next => action => {
        if (action && typeof action === 'function'){
            return action(dispatch);
        }
        else {
            return next(action);
        }
    }
}