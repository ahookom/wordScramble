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



export default class Viewport extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(store.getState(),{
      pan: new Animated.ValueXY,
      dropZoneValues: {},
    });

    this.renderDraggable = this.renderDraggable.bind(this);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        },
      ]),
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture)) {
          this.setState({ word: 'GIRL' });
        } else {
          Animated.spring(
            this.state.pan,
            { toValue: { x: 0, y: 0 } }
          ).start();
        }
      },
    });
  }

  componentDidMount(){
    this.unsubscribe = store.subscribe(()=>{this.setState(store.getState())});

  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  isDropZone(gesture) {
    var dz = this.state.dropZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  setDropZoneValues(event) {
    this.setState({
      dropZoneValues: event.nativeEvent.layout,
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topPad}>
          <Text style={styles.title}>WordScramble!</Text>
        </View>
        <View
          onLayout={this.setDropZoneValues.bind(this)}
          style={styles.dropZone}>

          <Word word={this.state.word} />

        </View>

        <PlayerCards style={styles.playerCards} renderDraggable={this.renderDraggable} />
      </View>
    );
  }

  renderDraggable(str,index) {

    return (
      <View style={styles.draggableContainer}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.state.pan.getLayout(), styles.circle]}>
          <Text key={index} style={styles.text}>{str}</Text>
        </Animated.View>
      </View>
    );
  }
}
