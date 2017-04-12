import {Dimensions, StyleSheet} from 'react-native';

let CIRCLE_RADIUS = 30;
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  border: {
    width: 5,
    height: 50,
    backgroundColor: '#2a3a30'
  },
  topPad: {
    flex: 1,
    alignItems: 'flex-end'
  },
  button: {
    flex: 1,
    marginBottom: 50
  },
  word: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dropZone: {
    backgroundColor: '#2c3e50',
    marginLeft: 50,
    marginRight: 50,
    marginTop: 50,
    borderRadius: 10,
    overflow: 'hidden'
  },
  playerCards: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30
  },
  playerCardsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
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
  currentLetterBox: {

  },
  center: {
    alignItems: 'center'
  },
  currentLetter:{
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 60,
    color: '#fff',
    marginBottom:8,
    marginLeft:8,
    marginRight:8,
    marginTop: 8,
    textAlign: 'center',
    backgroundColor: '#aaa'
  },
  draggableContainer: {
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  circle: {
    backgroundColor: '#1abc9c',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    overflow: 'hidden'
  },
});

export default styles;
