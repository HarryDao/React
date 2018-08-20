import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import ThunkMiddleware from './middlewares/thunk';
import './styles/index.less';
import reducers from './reducers';
import Game from './components/game';

const createStoreWithMiddleware = applyMiddleware(ThunkMiddleware)(createStore);


ReactDom.render( 
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Game />
    </Provider>    
,document.querySelector('#root'));