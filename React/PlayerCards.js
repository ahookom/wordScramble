import React, {Component} from 'react';
import styles from '../Styles/styles';
import {View, Text} from 'react-native';
import store from '../Redux/store';

export default class PlayerCards extends Component{
  constructor(props){
    super(props);
    this.state = {playerCards: store.getState().playerCards};
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => { this.setState({playerCards: store.getState().playerCards}) });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render(){
    let rows =[];
    let subtotal=0;
    while(this.state.playerCards.length-subtotal>5){
      rows.push(this.state.playerCards.slice(subtotal,subtotal+5));
      subtotal+=5;
    }
    if(subtotal<this.state.playerCards.length){
      rows.push(this.state.playerCards.slice(subtotal));
    }
    return (<View style={styles.playerCards}>{rows.map((row,index)=><View key={index} style={styles.playerCardsRow}>
         {row.map((letter,index)=>{return this.props.renderDraggable(letter,index)})}
        </View>)}</View>
    )
  }
}
