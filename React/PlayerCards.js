import React, {Component} from 'react';
import styles from '../Styles/styles';
import {View, Text} from 'react-native';
import store from '../Redux/store';

export default class PlayerCards extends Component{
  constructor(props){
    super(props);
    this.state = {playerCards: store.getState().playerCards};
  }



  render(){
    return (
        <View style={styles.playerCards}>
         {this.state.playerCards.map((letter,index)=>{return this.props.renderDraggable(letter,index)})}
        </View>
    )
  }
}
