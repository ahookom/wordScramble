import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Dimensions,
  Button
} from 'react-native';
import Word from './Word';
import PlayerCards from './PlayerCards';
import styles from '../Styles/styles.js';
import store from '../Redux/store.js';
import { removeLetter, updateWordAndRemoveCard, setCardLocation, setDropLocation, addPlayerCard, seedWord, setPlayerCards } from '../Redux/action-creators.js';
import Dictionary from '../Dictionary/Dictionary.js';
import wordlist from '../Dictionary/wordlist.js';
import commonWordList from '../Dictionary/commonwordlist.js';

const STARTINGCARDS = 10;
const LETTER_FREQUENCIES = {
  A: 8.12,
  B: 1.49,
  C: 2.71,
  D: 4.32,
  E: 12.02,
  F: 2.30,
  G: 2.03,
  H: 5.92,
  I: 7.31,
  J: 0.10,
  K: 0.69,
  L: 3.98,
  M: 2.61,
  N: 6.95,
  O: 7.68,
  P: 1.82,
  Q: 0.11,
  R: 6.02,
  S: 6.28,
  T: 9.10,
  U: 2.88,
  V: 1.11,
  W: 2.09,
  X: 0.17,
  Y: 2.11,
  Z: 0.07
}
const LETTER_TABLE = [];

export default class Viewport extends Component {
  constructor(props) {
    super(props);

    this.state = store.getState();
    this.pan = {};
    this.panResponders = {};
    this.playerCards = {};
    this.dictionary = new Dictionary();
    this.renderDraggable = this.renderDraggable.bind(this);
    this.addElementToViewport = this.addElementToViewport.bind(this);
    this.createCardResponder = this.createCardResponder.bind(this);
    // this.createLetterResponder = this.createLetterResponder.bind(this);
    this.handleDropZone = this.handleDropZone.bind(this);
    this.isValidWord = this.isValidWord.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => { this.setState(store.getState()) });
    this.dictionary.bulkAddWords(wordlist);
    let newWord = randomWord();
    store.dispatch(seedWord(newWord));
    seedLetterTable();
    let currentCards = [];
    while (currentCards.length < STARTINGCARDS) {
      currentCards.push(getNewCard(currentCards, newWord, this.state.mostRecentPlayerCards));
    }
    store.dispatch(setPlayerCards(currentCards));

  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  isDropZone(moveX, moveY) {
    if (moveX > this.dropZone.x && moveY > this.dropZone.y && moveY < (this.dropZone.y + this.dropZone.height) && moveX < (this.dropZone.x + this.dropZone.width)) {
      return true;
    } else {
      return false;
    }
  }

  render() {

    return (
      <View style={styles.mainContainer}>
        <View style={styles.topPad}>
          <Text style={styles.title}>WordScramble!</Text>
        </View>
        <View
          onLayout={event => this.dropZone = event.nativeEvent.layout}
          style={styles.dropZone}>

          <Word word={this.state.word} isValidWord = {this.isValidWord} />

        </View>

        <PlayerCards style={styles.playerCards} renderDraggable={this.renderDraggable} />
        <Button
          onPress={this.reset}
          title="RESET"
          color="#841584"
          style={styles.button}
          accessibilityLabel="Reset button"
        />
      </View>
    );
  }
  reset() {
    let newWord = randomWord();
    store.dispatch(seedWord(randomWord()));
    let currentCards = [];
    while (currentCards.length < STARTINGCARDS) {
      currentCards.push(getNewCard(currentCards, newWord, this.state.mostRecentPlayerCards));
    }
    store.dispatch(setPlayerCards(currentCards));
  }

  addElementToViewport(str) {
    function addRef(element) {
      this.playerCards[str] = element;
    }
    return addRef.bind(this);
  }

  renderDraggable(str, index) {
    if (!this.pan[str]) this.pan[str] = new Animated.ValueXY;
    if (!this.panResponders[str]) this.createCardResponder(str);
    let panResponder = this.panResponders[str];
    return (
      <Animated.View
        key={index}
        {...panResponder.panHandlers}
        ref={this.addElementToViewport(str)}
        onLayout={setLocationOfCard(str)}
        style={[this.pan[str].getLayout(), styles.circle, styles.draggableContainer]}>
        <Text style={styles.text}>{str}</Text>
      </Animated.View>
    );
  }

  handleDropZone(str, xCoord) {
    let index = this.getIndex(xCoord);
    let newWord = this.state.word.split('');
    if(index%1){
      newWord.splice(index+.5,0,str);
    }else{
      newWord.splice(index, 1, str);
    }
    newWord = newWord.join('');
    if (this.isValidWord(newWord)) {
      store.dispatch(updateWordAndRemoveCard(newWord, str));
      let newCard = getNewCard(this.state.playerCards, newWord, this.state.mostRecentPlayerCards);
      store.dispatch(addPlayerCard(newCard));
      return true;
    }
    return false;
  }

  getIndex(xCoord) {
    xCoord -= this.dropZone.x;
    let letters = this.state.dropLocations;
    for (var i = 0; i < Object.keys(letters).length; i++) {
      if (xCoord< letters[i].x)return i-0.5;
      if (xCoord > letters[i].x && xCoord < letters[i].x + letters[i].width) return i;
    }
    return i-0.5;
  }
  isValidWord(word) {
    return this.dictionary.search(word);
  }

  createCardResponder(str) {
    this.panResponders[str] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gesture) => {
        this.pan[str].setOffset({ x: 0, y: 0 });
        this.pan[str].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (event, gesture) => {
        this.pan[str].x.setValue(gesture.dx);
        this.pan[str].y.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture.moveX, gesture.moveY) && this.handleDropZone(str, gesture.moveX)) {
          this.pan[str] = null;
        } else {
          Animated.spring(
            this.pan[str],
            { toValue: { x: 0, y: 0 } }
          ).start();
        }
      },
    })
    return this.panResponders[str];
  }

  getPossibleWords() {
    let possibleWords = [];
    const word = this.state.word;
    const currentCards = this.state.playerCards;
    //try removing each letter
    for(let i = 0 ; i<word.length;i++){
      let newWord = word.slice(0,i)+word.slice(i+1);
      if(this.isValidWord(newWord)){
        possibleWords.push(newWord)
      }
    }
    //try adding each letter to each position
    currentCards.forEach(letter=>{
      for(let i = 0 ; i<=word.length;i++){
        let newWord = word.slice(0, i) + letter + word.slice(i);
        if(this.isValidWord(newWord)){
          possibleWords.push(newWord)
        }
      }
    })
    //try substituting each letter into each position
    currentCards.forEach(letter=>{
      for (let i = 0 ; i < word.length;i++){
        let newWord = word.slice(0,i) + letter + word.slice(i+1);
        if (this.isValidWord(newWord)){
          possibleWords.push(newWord)
        }
      }
    })

    return possibleWords;

  }

}

function randomWord() {
  let temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  while(temp.length!==4){
    temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  }
  return temp;
}

function setLocationOfCard(str) {
  return (event) => {
    store.dispatch(setCardLocation(str, event.nativeEvent.layout))
  }
}

function getNewCard(currentCards, word, mostRecent) {
  let invalid = currentCards.join('') + word + mostRecent.join('');

  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let pick = LETTER_TABLE[Math.floor(Math.random() * LETTER_TABLE.length)];

  while (invalid.includes(pick)) {
    pick = LETTER_TABLE[Math.floor(Math.random() * LETTER_TABLE.length)];
  }

  return pick;

}


function seedLetterTable(){
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let letterArr = letters.split('');
  letterArr.forEach(letter=>{
    let desiredNumber = Math.round(LETTER_FREQUENCIES[letter]*100);
    while(desiredNumber){
      LETTER_TABLE.push(letter);
      desiredNumber--;
    }
  })
}
