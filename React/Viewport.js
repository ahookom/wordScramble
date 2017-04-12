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
import { updateWordAndRemoveCard, setCardLocation, setDropLocation, addPlayerCard, seedWord, setPlayerCards } from '../Redux/action-creators.js';
import Dictionary from '../Dictionary/Dictionary.js';
import wordlist from '../Dictionary/wordlist.js';

const STARTINGCARDS = 10;

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
    this.createLetterResponder = this.createLetterResponder.bind(this);
    this.handleDropZone = this.handleDropZone.bind(this);
    this.isValidWord = this.isValidWord.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => { this.setState(store.getState()) });
    this.dictionary.bulkAdd(wordlist);
    let newWord = randomWord();
    store.dispatch(seedWord(newWord));
    let currentCards = [];
    while (currentCards.length < STARTINGCARDS) {
      currentCards.push(getNewCard(currentCards, newWord));
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

          <Word word={this.state.word} createLetterResponder={this.createLetterResponder} />

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
      currentCards.push(getNewCard(currentCards, newWord));
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
    if (!this.isValidWord(newWord)) {
      store.dispatch(updateWordAndRemoveCard(newWord, str));
      let newCard = getNewCard(this.state.playerCards, newWord);
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

  createLetterResponder(str) {
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
}

function randomWord() {
  return wordlist[Math.floor(Math.random() * wordlist.length)];
}

function setLocationOfCard(str) {
  return (event) => {
    store.dispatch(setCardLocation(str, event.nativeEvent.layout))
  }
}

function getNewCard(currentCards, word) {
  let invalid = currentCards.join('') + word;

  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let pick = letters.charAt(Math.floor(Math.random() * 26));

  while (invalid.includes(pick)) {
    pick = letters.charAt(Math.floor(Math.random() * 26));
  }
  return pick;
}


