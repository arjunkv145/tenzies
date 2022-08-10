import { useState, useEffect } from 'react';
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Duration from "./Duration"
import Die from "./Die"
import './App.css';

export default function App() {

    const [dice, setDice] = useState(() => allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rolls, setRolls] = useState(0)
    
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRolls(p => p + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
        }
    }
    
    function holdDice(id) {
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.id === id ? 
                    {...die, isHeld: !die.isHeld} :
                    die
            }))
        }
    }
    
    const diceElements = dice.map((die, i, arr) => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld}
            className={ arr.length === ( i + 1 ) ? ' last-die' : '' }
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <div className='tenzies-container'>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice_new-game" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="score-container">
                <p className="num-of-rolls">
                    <span className='bold'>
                        No of rolls&nbsp;
                    </span>
                    - {rolls}
                </p>
                <Duration tenzies={tenzies}/>
            </div>
        </div>
    )
}
