import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';

let board = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const NBR_OF_POINTS = 6;

let pointButtons = [];
let pisteNumerot = [];

export default function Gameboard() {

    const [diceThrowsLeft, setDiceThrowsLeft] = useState(NBR_OF_THROWS);
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [status, setStatus] = useState("Throw dices.");
    const [totalPoints, setTotalPoints] = useState(0);
    const [bonusPoints, setBonusPoints] = useState(63);
    const [pointBtns, setPointBtns] = useState([]);
    const [selectedPoints, setSelectedPoints] = useState(new Array(7).fill(false));
    const [dicePoints, setDicePoints] = useState(0);
    const [bonusMsg1, setBonusMsg1] = useState('You are ');
    const [bonusMsg2, setBonusMsg2] = useState(' points away from bonus');

    useEffect(() => {
        pisteButtons();
        if (diceThrowsLeft < 0) {
            setDiceThrowsLeft(NBR_OF_THROWS - 1);
        }
        if (bonusPoints < 0) {
            setBonusMsg1(' ');
            setBonusMsg2(' ');
            setBonusPoints('You got the bonus!')
        }
    }, [diceThrowsLeft]);

    function throwDices() {
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (diceThrowsLeft > 0) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
            }    
            }     
        setStatus('Select and throw dices again');
        if (diceThrowsLeft >= 1) {
            setDiceThrowsLeft(diceThrowsLeft - 1);  
            setStatus('Select and throw dices again');
        }
        if (diceThrowsLeft === 1) {
            setStatus('Select your points and throw again');
        }
        if (diceThrowsLeft === 0 && selectedPoints[1] === false 
        && selectedPoints.every((val, i, arr) => val === arr[1])) {
            setStatus('Select your points before throwing again');
        }
        }
    }

    function selectDice(i) {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
        const välipisteet = Number(board[i].slice(-1)[0]);
        if (selectedDices[i] === false) {
            setDicePoints(dicePoints + välipisteet);
        } else {
            setDicePoints(dicePoints - välipisteet);
        }
        
    }

    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "steelblue";
    }

    const nopat = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        nopat.push(
            <Pressable
                key={'dicerow' + i}
                onPress={() => selectDice(i)}>
            <MaterialCommunityIcons
                name={board[i]}
                key={'dicerow' + i}
                size={50}
                color={getDiceColor(i)}>
            </MaterialCommunityIcons>
            </Pressable>
        );
    }

    function pisteButtons() {
        for (let i = 0; i <= 7; i++) {
            pointButtons[i] = 'numeric-' + i + '-circle';
        }
        setPointBtns(pointButtons);
    }

    function getPointColor(i) {
        return selectedPoints[i] ? "black" : "steelblue";
    }

    function selectPoint(i) {
        let pisteet = [...selectedPoints];
        if (diceThrowsLeft === 0 && selectedPoints[i] === false) {
            pisteet[i] = selectedPoints[i] ? false : true;
            setSelectedPoints(pisteet);
            setDiceThrowsLeft(3);
            setStatus('Throw dices');
            resetDice();
            pisteNumerot[i] = dicePoints;
            setTotalPoints(totalPoints + dicePoints); 
            setDicePoints(0);
            setBonusPoints(bonusPoints - dicePoints);
            pisteet[0] = true;
        }
        if (pisteet.every((val, i, arr) => val === arr[0])) {
            setStatus('Game over, all points selected');
            setDiceThrowsLeft(0);
        }
        if (bonusPoints < 0) {
            setBonusMsg1(' ');
            setBonusMsg2(' ');
            setBonusPoints('You got the bonus');
        }
        if (isNaN(bonusPoints)) {
            setBonusPoints('You got the bonus');
        }
        
    }

    const pntBtnRow = [];
    const pisteRivi = [];
    for (let i = 1; i < 7; i++) {
        pntBtnRow.push(
            pisteNumerot[i],
            <Pressable
                key={'pntbtnrow' + i}
                onPress={() => selectPoint(i)}>
            <MaterialCommunityIcons
                name={pointButtons[i]}
                key={'pntbtnrow' + i}
                size={50}
                color={getPointColor(i)}>
            </MaterialCommunityIcons>
            </Pressable>
        );
    }

    function resetDice() {
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    }

    return(
        <View style={styles.gameboard}>
            <View style={styles.flex}>{nopat}</View>
            <Text style={styles.gameinfo}>Throws left: {diceThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>
            <Pressable
            style={styles.button}
            onPress={()=>throwDices()}>
            <Text style={styles.buttonText}>Throw dices</Text>
            </Pressable>
            <Text style={styles.gameinfo}>Total: {totalPoints}</Text>
            <Text style={styles.bonus}>{bonusMsg1}{bonusPoints}{bonusMsg2}</Text>
            <View style={styles.pointrivi}>{pisteRivi}</View>
            <View style={styles.flex}>{pntBtnRow}</View>
        </View>
    )
}