import { hands } from '../constants/actions';
import styles from './component.module.css';

function Arena({ player1, player2, turn, lastAction }) {
    return (
        <div>
            <h2>Arena</h2>
            {lastAction && lastAction.action.type === 'attack' && `Player ${lastAction.player.id} ${lastAction.action.name.toLowerCase()}`}
            {lastAction && lastAction.action.type !== 'attack' && `Player ${lastAction.player.id} used a spell`}<br />
            It is time for player {turn} to make a move <br />
            <div className={styles.player1}>
                <div className={styles.hpBar} style={{ width: `${player1.health}px` }}></div>
                <div className={styles.mpBar} style={{ width: `${player1.mana}px` }}></div>
            </div>
            <div className={styles.player2}>
                <div className={styles.hpBar} style={{ width: `${player2.health}px` }}></div>
                <div className={styles.mpBar} style={{ width: `${player2.mana}px` }}></div>
            </div>
            {player1.sequence.length > 0 && player1.sequence.map(hand => hands[hand]).join(',')}
            <br />
            {player2.sequence.length > 0 && player2.sequence.map(hand => hands[hand]).join(',')}
        </div>
    );
}

export default Arena;
