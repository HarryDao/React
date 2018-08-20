import React from 'react';
import {Transition} from 'react-transition-group';

export function Fade({in: inProp}, componentCreator){
    const duration = 300;

    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
        display: 'none',
    }

    const transitionStyles = {
        entering: { opacity: 0, display: 'block' },
        entered: { opacity: 1, display: 'block' },
        exiting: {opacity: 0, display: 'block'},
    }

    return(
        <Transition in={inProp} timeout={duration}>
            {
                state=> ((state)=> {
                    return componentCreator({
                        ...defaultStyle,
                        ...transitionStyles[state]      
                    })
                })(state)
            }
        </Transition>       
    );
}
