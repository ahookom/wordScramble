import React, { Component, } from 'react';
import { View, Text } from 'react-native';
import  styles  from '../Styles/styles.js';
import store from '../Redux/store.js';
import {setDropLocation} from '../Redux/action-creators.js';
import Border from './Border.js';

class Word extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  setDropZoneValues(index) {
    return (event)=>store.dispatch(setDropLocation(index, Object.assign({}, event.nativeEvent.layout)));
  }

  render() {
    return (
      <View style={styles.word}>
        {this.props.word.split('').map((letter, key) => (
          <Text onLayout={this.setDropZoneValues(key)} key={key} style={styles.currentLetter}>{letter}</Text>
        ))}
      </View>
    );
  }
}

export default Word;


