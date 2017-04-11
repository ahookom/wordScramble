import {Dimensions, StyleSheet} from 'react-native';

let CIRCLE_RADIUS = 30;
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
    overflow: 'hidden'
  },
  playerCards: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginTop: 60,
    marginLeft: 30,
    marginRight: 30
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
    overflow: 'hidden'
  },
});

export default styles;
