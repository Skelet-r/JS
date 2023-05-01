import { useEffect } from 'react';
import Button from './Button';
import { hands } from '../constants/actions';

function ActionMenu({ player, playerChoice }) {
    const keyup = (evt) => {
        switch (evt.code) {
            case 'KeyQ': player === 1 && playerChoice(0); break;
            case 'KeyW': player === 1 && playerChoice(1); break;
            case 'KeyE': player === 1 && playerChoice(2); break;
            case 'Digit1': player === 2 && playerChoice(0); break;
            case 'Digit2': player === 2 && playerChoice(1); break;
            case 'Digit3': player === 2 && playerChoice(2); break;
            default: break
        }
    };

    useEffect(() => {
        document.addEventListener('keyup', keyup, false);
        return () => document.removeEventListener('keyup', keyup);
    });
    return (
        <div>
            {player === 1 && (<>
                <Button onClick={() => playerChoice(0)} text={hands[0] + " (q)"}></Button>
                <Button onClick={() => playerChoice(1)} text={hands[1] + " (w)"}></Button>
                <Button onClick={() => playerChoice(2)} text={hands[2] + " (e)"}></Button>
            </>)}
            {player === 2 && (<>
                <Button onClick={() => playerChoice(0)} text={hands[0] + " (1)"}></Button>
                <Button onClick={() => playerChoice(1)} text={hands[1] + " (2)"}></Button>
                <Button onClick={() => playerChoice(2)} text={hands[2] + " (3)"}></Button>
            </>)}
        </div>
    )
}

export default ActionMenu;
