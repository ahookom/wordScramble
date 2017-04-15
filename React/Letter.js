import React, {Component} from 'react';
import styles from '../Styles/styles';
import {View, Text, Animated, PanResponder} from 'react-native';
import store from '../Redux/store';
import {removeLetter} from '../Redux/action-creators';
import {setDropLocation} from '../Redux/action-creators.js';
import { isValidWord } from '../utils/wordutils';

export default class Letter extends Component{
  constructor(props){
    super(props);
    this.state = {responder:{}};
    this.letterResponders = {};
  }

  componentDidMount() {
    let temp = this.createLetterResponder(this.props.index);
    this.setState({responder: temp.responder});
    this.pan = temp.pan;
  }

  componentWillUnmount() {

  }

  makesValidWord(index){
    let newWord = this.props.word.split('');
    newWord.splice(index,1);
    return isValidWord(newWord.join(''));
  }

  createLetterResponder(index) {
    this.panLetter = new Animated.ValueXY;
    this.letterResponders[index] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gesture) => {
        this.panLetter.setOffset({ x: 0, y: 0 });
        this.panLetter.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (event, gesture) => {
        this.panLetter.x.setValue(gesture.dx);
        this.panLetter.y.setValue(gesture.dy);
      },

      onPanResponderRelease: (e, gesture) => {
        if (Math.abs(gesture.dx)+Math.abs(gesture.dy)>10&&this.makesValidWord(index)){
          store.dispatch(removeLetter(index));
          this.panLetter.setOffset({ x: 0, y: 0 });
          this.panLetter.setValue({ x: 0, y: 0 });
        } else {
          Animated.spring(
            this.panLetter,
            { toValue: { x: 0, y: 0 } }
          ).start();
        }
      },
    })
    return {responder: this.letterResponders[index], pan: this.panLetter[index]};
  }

  setDropZoneValues(index) {
    return (event)=>store.dispatch(setDropLocation(index, Object.assign({}, event.nativeEvent.layout)));
  }

  render(){
    return <Animated.View onLayout={this.setDropZoneValues(this.props.index)} style={[styles.currentLetter, this.panLetter ? this.panLetter.getLayout() : null]} {...this.state.responder.panHandlers}><Text style={[styles.letter,{'fontSize':160/this.props.wordLength}]}>{this.props.letter}</Text></Animated.View>
  }
}
