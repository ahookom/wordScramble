import React, { Component, } from 'react';
import { View, Text } from 'react-native';
import  styles  from '../Styles/styles.js';
import store from '../Redux/store.js';
import {setDropLocation} from '../Redux/action-creators.js';
import Border from './Border.js';
import Letter from './Letter.js';

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
          <Letter isValidWord={this.props.isValidWord} key={key} letter={letter} index={key} wordLength={this.props.word.length} word={this.props.word} />
        ))}
      </View>
    );
  }
}

export default Word;


