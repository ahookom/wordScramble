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
import styles from '../Styles/styles.js';

export default class Viewport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(), //Step 1
      word: ['A', 'B', 'C', 'D'],
      dropZoneValues: {},
    };

    this.panResponder = PanResponder.create({
      //Step 2
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {
          //Step 3
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        },
      ]),
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture)) {
          this.setState({ word: ['G', 'I', 'R', 'L'] });
        } else {
          Animated.spring(
            //Step 1
            this.state.pan, //Step 2
            { toValue: { x: 0, y: 0 } } //Step 3
          ).start();
        }
      }, //Step 4
    });
  }

  isDropZone(gesture) {
    var dz = this.state.dropZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  setDropZoneValues(event) {
    //Step 1
    this.setState({
      dropZoneValues: event.nativeEvent.layout,
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topPad}>
          <Text style={styles.title}>WordScramble</Text>
        </View>
        <View
          onLayout={this.setDropZoneValues.bind(this)}
          style={styles.dropZone}>

          <Word word={this.state.word} style={styles.text} styles={styles} />

        </View>

        <View style={styles.playerCards}>
          {this.renderDraggable('a')}
          {this.renderDraggable('b')}
          {this.renderDraggable('t')}
        </View>
      </View>
    );
  }

  renderDraggable(str) {
    return (
      <View style={styles.draggableContainer}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.state.pan.getLayout(), styles.circle]}>
          <Text style={styles.text}>{str}</Text>
        </Animated.View>
      </View>
    );
  }
}
