import styles from '../Styles/styles.js';

let initialState = {
  word: 'SNAP',
  playerCards: ['T', 'P', 'B', 'Q', 'L','A','F'],
  dropLocations: {},
  cardLocations: {}
}

export default function(state = initialState, action){

  let newState = Object.assign({}, state);

  switch (action.type){

  case 'SET_CARD_LOCATION':
    newState.cardLocations = Object.assign({}, newState.cardLocations, {[action.letter]: action.layout})
  break;

  case 'SET_DROP_LOCATION':
    newState.dropLocations[action.index] = Object.assign({}, action.layout);
  break;

  case 'UPDATE_WORD':
    newState.word = action.word;
    newState.playerCards = newState.playerCards.filter(card=>card!==action.card);
  break;

  case 'ADD_PLAYER_CARD':
    newState.playerCards = [...newState.playerCards,action.card];
  break;

  case 'RECEIVE_DICTIONARY':
  break;

  case 'REMOVE_LETTER':
  break;
  }

  return newState;

}
