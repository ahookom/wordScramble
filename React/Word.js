import React, { Component, } from 'react';
import { View, Text } from 'react-native';
import  styles  from '../Styles/styles.js';

class Word extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

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

export default Word;
