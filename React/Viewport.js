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
import { removeLetter, updateWordAndRemoveCard, setCardLocation, setDropLocation, addPlayerCard, seedWord, setPlayerCards, cycleMode, clearMostRecentCards, setOriginalWord } from '../Redux/action-creators.js';
import { isValidWord, getPossibleWords, getNewCard, randomWord, dictionary, getStandardStart, getPathStart } from '../utils/wordutils';
// import wordlist from '../Dictionary/wordlist.js';
// import commonWordList from '../Dictionary/commonwordlist.js';

const STARTINGCARDS = 10;


export default class Viewport extends Component {
  constructor(props) {
    super(props);

    this.state = store.getState();
    this.pan = {};
    this.panResponders = {};
    this.playerCards = {};
    this.renderDraggable = this.renderDraggable.bind(this);
    this.addElementToViewport = this.addElementToViewport.bind(this);
    this.createCardResponder = this.createCardResponder.bind(this);
    // this.createLetterResponder = this.createLetterResponder.bind(this);
    this.handleDropZone = this.handleDropZone.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => { this.setState(store.getState()) });
    this.reset();
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
          <Text style={styles.subtitle}>{`${this.state.mode} mode`}</Text>
        </View>
        <View
          onLayout={event => this.dropZone = event.nativeEvent.layout}
          style={styles.dropZone}>

          <Word word={this.state.word} />

        </View>

        <PlayerCards style={styles.playerCards} renderDraggable={this.renderDraggable} />
        <View style={{ flex: 1, flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'space-between'}}>
          <Button
            onPress={this.changeMode}
            title="MODE"
            color="#841584"
            style={styles.button}
            accessibilityLabel="Change mode button"
          />
         {this.state.mode === 'path' ? <Button
            onPress={this.reset}
            title="REWIND"
            color="#841584"
            style={styles.button}
            accessibilityLabel="Reset button"
          /> : null }

          <Button
            onPress={this.rewind}
            title="RESET"
            color="#841584"
            style={styles.button}
            accessibilityLabel="Reset button"
          />

        </View>
      </View>
    );
  }

  changeMode() {
    store.dispatch(cycleMode());
  }

  rewind() {
    let currentCards  = this.state.playerCards;
    let usedCards = this.state.mostRecentPlayerCards;
    let originalWord = this.state.originalWord;

    store.dispatch(setPlayerCards(currentCards.concat(usedCards)));
    store.dispatch(seedWord(originalWord));
  }

  reset() {
    let newWord, newCards;
    if(this.state.mode==='standard'){
      let newCardsAndWord = getStandardStart();
      newWord = newCardsAndWord.newWord;
      newCards = newCardsAndWord.newCards;
    } else if(this.state.mode === 'path'){
      let newCardsAndWord = getPathStart();
      newWord = newCardsAndWord.newWord;
      newCards = newCardsAndWord.newCards;
    }
    store.dispatch(seedWord(newWord));
    store.dispatch(clearMostRecentCards());
    store.dispatch(setPlayerCards(newCards));
    store.dispatch(setOriginalWord(newWord));
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
    if (index % 1) {
      newWord.splice(index + .5, 0, str);
    } else {
      newWord.splice(index, 1, str);
    }
    newWord = newWord.join('');
    if (isValidWord(newWord)) {
      store.dispatch(updateWordAndRemoveCard(newWord, str));
      if(this.mode==='standard'){
        let newCard = getNewCard(this.state.playerCards, newWord, this.state.mostRecentPlayerCards);
        store.dispatch(addPlayerCard(newCard));
      }
      return true;
    }
    return false;
  }

  getIndex(xCoord) {
    xCoord -= this.dropZone.x;
    let letters = this.state.dropLocations;
    for (var i = 0; i < Object.keys(letters).length; i++) {
      if (xCoord < letters[i].x) return i - 0.5;
      if (xCoord > letters[i].x && xCoord < letters[i].x + letters[i].width) return i;
    }
    return i - 0.5;
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

}

function setLocationOfCard(str) {
  return (event) => {
    store.dispatch(setCardLocation(str, event.nativeEvent.layout))
  }
}
