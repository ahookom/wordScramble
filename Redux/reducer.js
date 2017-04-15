import styles from '../Styles/styles.js';

let initialState = {
  word: '',
  playerCards: [],
  dropLocations: {},
  cardLocations: {},
  cardCounter: 0,
  mostRecentPlayerCards: [],
  mode: 'standard',
  possibleModes: ['standard','path'],
  originalWord: '',
  targetWord: ''
}

export default function(state = initialState, action){

  let newState = Object.assign({}, state);

  switch (action.type){

  case 'CLEAR_RECENT_CARDS':
    newState.mostRecentPlayerCards = [];
  break;

  case 'SET_ORIGINAL_WORD':
    newState.originalWord = action.word;
  break;

  case 'SET_CARD_LOCATION':
    newState.cardLocations = Object.assign({}, newState.cardLocations, {[action.letter]: action.layout})
  break;

  case 'SET_DROP_LOCATION':
    newState.dropLocations[action.index] = Object.assign({}, action.layout);
  break;

  case 'UPDATE_WORD':
    newState.word = action.word;
    newState.playerCards = newState.playerCards.filter(card=>card!==action.card);
    if(newState.mode==='path'){
      newState.mostRecentPlayerCards = [...newState.mostRecentPlayerCards, action.card];
    }else{
      newState.mostRecentPlayerCards = [...newState.mostRecentPlayerCards.slice(-4), action.card];
    }
  break;

  case 'ADD_PLAYER_CARD':
    newState.playerCards = [...newState.playerCards,action.card];
    newState.cardCounter++;
  break;

  case 'SET_PLAYER_CARDS':
    newState.playerCards = action.cards;
  break;

  case 'SEED_WORD':
    newState.word = action.word;
  break;

  case 'CHANGE_MODE':
    console.log('changing mode in reducer with action.mode',action.mode, 'current', newState.mode);
    if(action.mode!=='NEXT') newState.mode = action.mode;
    else{
      let currentModeIndex = newState.possibleModes.indexOf(newState.mode);
      newState.mode = newState.possibleModes[(currentModeIndex+1)%newState.possibleModes.length];
    }
  break;

  case 'REMOVE_LETTER':
    let temp = newState.word.split('')
    temp.splice(action.index,1);
    newState.word = temp.join('');
  break;
  }

  return newState;

}
