import React, { Component, } from 'react';
import { View, Text } from 'react-native';
import  styles  from '../Styles/styles.js';
import store from '../Redux/store.js';
import {setDropLocation} from '../Redux/action-creators.js';
import Border from './Border.js';
import Letter from './Letter.js';

class ModeSelector extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View >

      </View>
    );
  }
}

export default ModeSelector;
