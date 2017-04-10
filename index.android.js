import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
// import { Constants } from 'expo';

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

          <Word word={this.state.word} style={styles.text} />

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

class Word extends React.Component {
  render() {
    return (
      <View style={styles.word}>
        {this.props.word.map((letter, key) => (
          <Text style={styles.currentLetters} key={key}>{letter}</Text>
        ))}
      </View>
    );
  }
}

let CIRCLE_RADIUS = 36;
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  topPad: {
    flex: 1,
  },
  word: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dropZone: {
    backgroundColor: '#2c3e50',
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 10,
  },
  playerCards: {
    flex: 2,
  },
  text: {
    marginTop: 0,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff',
    fontSize: 50,
  },
  title: {
    marginTop: 65,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#6495ed',
    fontSize: 50,
  },
  currentLetters: {
    flex: 1,
    textAlign: 'center',
    color: '#6495ed',
    fontSize: 60,
  },
  draggableContainer: {
    flex: 1
  },
  circle: {
    backgroundColor: '#1abc9c',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
});


AppRegistry.registerComponent('Viewport', () => Viewport);
