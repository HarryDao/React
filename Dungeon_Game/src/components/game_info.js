import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {GAME} from '../configs/game_config'
import {CELL_IMAGES, INFO_IMAGES} from '../configs/images';


class GameInfo extends Component {
    constructor(props){
        super(props);
        this.onDarknessClick = this.onDarknessClick.bind(this);
    }

    onDarknessClick(){
        this.props.toggleDarkness();
    }

    render() {
        const {player, gameLevel, darkness} = this.props;
        if (!player){
            return <div>Loading...</div>;
        }

        return(
            <div className="game-info">
                <div className="title">
                    <h1 className="game-title">Dungeon Game with React/Redux</h1>
                    <h4 className="quest">Quest: Kill boss <img src={CELL_IMAGES.boss}/> at Dungeon level {GAME.GAME_TOTAL_LEVELS} </h4>
                </div>
                <div className="info">
                    <div className="stats">
                        <div className="stat"><img src={INFO_IMAGES.health} /> {player.health}</div>
                        <div className="stat"><img src={CELL_IMAGES.weapon} /> {player.weapon.name} ({player.weapon.attack})</div>
                        <div className="stat">Lv: {player.level}</div>
                        <div className="stat">Next Lv: {player.exp} XP</div>
                        <div className="stat">Atk: {player.attack}</div>

                        <div className="stat">Dungeon: {gameLevel}</div>
                    </div>
                    <div className="darkness">
                        <button
                            onClick={this.onDarknessClick}
                        >Toggle darkness</button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps({game}){
    return {
        player: game.player,
        gameLevel: game.gameLevel,
        darkness: game.darkness
    };
}

export default connect(mapStateToProps, actions)(GameInfo);