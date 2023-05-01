import { useState, useEffect } from 'react';
import styles from './components/component.module.css';
import './App.css';
import ActionMenu from './components/ActionMenu';
import Arena from './components/Arena';
import Button from './components/Button';
import { actions } from './constants/actions';

import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';


const ydoc = new Y.Doc();
const provider = new WebrtcProvider(`test`, ydoc);
console.log(ydoc);
function App() {
  const MAX_SEQUENCE = 4;
  const MAX_HP = 100;
  const MAX_MP = 100;
  const p1 = {
    sequence: [],
    score: 0,
    mana: MAX_MP,
    health: MAX_HP,
    id: 1,
  };
  const p2 = {
    sequence: [],
    score: 0,
    mana: MAX_MP,
    health: MAX_HP,
    id: 2,
  };
  const [state, setLocalState] = useState({
    turn: p1.id,
    connectedPlayers: [],
    p1,
    p2,
    lastAction: null
  });

  useEffect(() => {
    const ymap = ydoc.getMap('state');
    ymap.observe(() => {
      setLocalState({
        ...ymap.get('state')
      });
      console.log('helo', ymap.get('state'));
    });
    const currentState = { ...state, ...ymap.get('state') };
    const allPlayers = [currentState.p1, currentState.p2];
    if (allPlayers.find(p => p.id == ydoc.clientID)) {

    } else if (currentState.connectedPlayers.length > 2) {
      return (<div>Too many players connected.</div>)
    } else {
      const idx = currentState.connectedPlayers.push(ydoc.clientID);
      const player = currentState['p' + idx] || {};
      if (currentState.turn === player.id) currentState.turn = ydoc.clientID;
      player.id = ydoc.clientID;
      setState(currentState);
    }
    //return provider.disconnect;
  }, []);

  const setState = (state) => {
    //setLocalState(state);
    const ymap = ydoc.getMap('state');
    ymap.set('state', state);
  }

  const p1Change = (newP1) => {
    setState({
      ...state,
      p1: newP1
    });
  };

  const p2Change = (newP2) => {
    setState({
      ...state,
      p2: newP2
    });
  };
  const changeTurn = (id) => {
    setState({
      ...state,
      turn: id,
    });
  };
  const setLastAction = (lastAction) => {
    setState({
      ...state,
      lastAction: lastAction,
    });
  };

  const getCurrentPlayer = () => {
    const players = {}
    players[state.p1.id] = { p: state.p1, change: p1Change };
    players[state.p2.id] = { p: state.p2, change: p2Change };
    return players[state.turn];
  };

  const playerChoice = (choice) => {
    const player = getCurrentPlayer();
    player.change({ ...player.p, sequence: [...player.p.sequence, choice].slice(0, MAX_SEQUENCE) });
  };

  const reset = () => {
    const player = getCurrentPlayer();
    player.p.sequence.splice(0, MAX_SEQUENCE)
    player.change({ ...player.p });
  };

  const matchAction = (player) => {
    const sequence = player.sequence;
    const matchedActions = actions.filter(action => {
      const sameLength = action.sequence.length === sequence.length;
      const nonMatchingElements = action.sequence.filter((hand, i) => hand !== sequence[i]);
      return sameLength && nonMatchingElements.length === 0;
    });
    return matchedActions;
  };

  const jutsu = () => {
    const player = getCurrentPlayer();
    const action = matchAction(player.p);
    if (action.length > 0) {
      const opositePlayer = {};
      opositePlayer[state.p1.id] = state.p2;
      opositePlayer[state.p2.id] = state.p1;
      player.p.sequence.splice(0, player.p.sequence.length);
      makeAction(action[0], player.p, opositePlayer[player.p.id]);
      changeTurn(opositePlayer[player.p.id].id);
      setLastAction({
        action: action[0],
        player: player.p,
        opositePlayer: opositePlayer[player.p.id],
      });
    }
  };

  const makeAction = (action, player, opositePlayer) => {
    if (player.mana >= (action.mpCost || 0)) {
      player.mana -= action.mpCost || 0;
      if (action.type === 'attack') {
        let value = action.value;
        console.log(state.lastAction, value);
        if (state.lastAction && state.lastAction.action.type === 'defend') {
          value -= Math.max(0, state.lastAction.action.value);
        }
        opositePlayer.health -= value;
      } else if (action.type === 'hp') {
        player.health = Math.min(MAX_HP, player.health + action.value);
      } else if (action.type === 'mp') {
        player.mana = Math.min(MAX_MP, player.mana + action.value);
      }
    }
  }

  return (
    <div className="App">
      <div className={styles.arena}>
        <Arena turn={state.turn} lastAction={state.lastAction} player1={state.p1} player2={state.p2}></Arena>
      </div>
      <Button onClick={jutsu} disabled={matchAction(getCurrentPlayer().p).length === 0} text="Jutsu"></Button>
      <Button onClick={reset} text="Reset"></Button>
      <hr></hr>
      <div><ActionMenu playerChoice={(c) => playerChoice(c)} player={state.turn}></ActionMenu></div>
    </div>
  );
}

export default App;
