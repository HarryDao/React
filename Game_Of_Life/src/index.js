import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import './styles/index.less';

import reducers from './reducers';
import BoardMain from './components/board_main';
import BoardController from './components/board_controller';
import BoardSettings from './components/board_settings';


const createStoreWithMiddleware = applyMiddleware()(createStore);


ReactDom.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <div className="inner">
            <BoardController />
            <BoardMain />
            <BoardSettings />
        </div>

    </Provider>
, document.querySelector('#root'));
