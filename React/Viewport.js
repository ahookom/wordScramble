import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';
import Word from './Word';
import PlayerCards from './PlayerCards';
import styles from '../Styles/styles.js';
import store from '../Redux/store.js';
import { updateWordAndRemoveCard, setCardLocation, setDropLocation , addPlayerCard } from '../Redux/action-creators.js';


export default class Viewport extends Component {
  constructor(props) {
    super(props);

    this.state = store.getState();
    this.pan = {};
    this.panResponders = {};
    this.playerCards = {};
    this.renderDraggable = this.renderDraggable.bind(this);
    this.addElementToViewport = this.addElementToViewport.bind(this);
    this.createPanResponder = this.createPanResponder.bind(this);
    this.handleDropZone = this.handleDropZone.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => { this.setState(store.getState()) });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  isDropZone(moveX, moveY) {
    if (moveX >  this.dropZone.x && moveY >  this.dropZone.y && moveY < (this.dropZone.y + this.dropZone.height) && moveX < (this.dropZone.x + this.dropZone.width)){
      return true;
    }else {
      return false;
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topPad}>
          <Text style={styles.title}>WordScramble!</Text>
        </View>
        <View onLayout={event => this.dropZone = event.nativeEvent.layout}
          style={styles.dropZone}>

          <Word word={this.state.word} />

        </View>

        <PlayerCards style={styles.playerCards} renderDraggable={this.renderDraggable} />
      </View>
    );
  }

  addElementToViewport(str) {
    function addRef(element) {
      this.playerCards[str] = element;
    }
    return addRef.bind(this);
  }

  renderDraggable(str, index) {
    if (!this.pan[str]) this.pan[str] = new Animated.ValueXY;
    let panResponder;
    if (!this.panResponders[str]){
      panResponder = this.createPanResponder(str);
    } else{
      panResponder = this.panResponders[str];
    }
    return (
        <Animated.View
          {...panResponder.panHandlers}
          ref={this.addElementToViewport(str)}
          onLayout={setLocationOfCard(str)}
          style={[this.pan[str].getLayout(), styles.circle,styles.draggableContainer]}>
          <Text key={index} style={styles.text}>{str}</Text>
        </Animated.View>
    );
  }

  handleDropZone(str, xCoord){
    let index = this.getIndex(xCoord);
    let newWord = this.state.word.split('');
    newWord.splice(index,1,str);
    newWord=newWord.join('');
    if(isValidWord(newWord)){
      store.dispatch(updateWordAndRemoveCard(newWord, str));
      let newCard = getNewCard(this.state.playerCards,newWord);
      store.dispatch(addPlayerCard(newCard));
      return true;
    }
    return false;
  }

  getIndex(xCoord){
    xCoord -= this.dropZone.x;
    let letters = this.state.dropLocations;
    for (let i = 0;i < Object.keys(letters).length;i++){
      if (xCoord > letters[i].x && xCoord < letters[i].x + letters[i].width) return i;
    }
  }

  createPanResponder(str) {
    this.panResponders[str] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this.pan[str].x.setValue(gesture.dx);
        this.pan[str].y.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture.moveX, gesture.moveY)&&this.handleDropZone(str, gesture.moveX)) {
          this.panResponders[str]=null;
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

function isValidWord(word){
  return true;
}

function setLocationOfCard(str) {
  return (event) => {
    store.dispatch(setCardLocation(str, event.nativeEvent.layout))
  }
}

function getNewCard(currentCards,word){
  let invalid = currentCards.join('')+word;

  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let pick = letters.charAt(Math.floor(Math.random()*26));

  while(invalid.includes(pick)){
    pick = letters.charAt(Math.floor(Math.random()*26));
  }
  return pick;
}
