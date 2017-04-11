import styles from '../Styles/styles.js';

let initialState={
  word:'SNAP',
  playerCards:['T','P','B','Q',"P","L"],
  dropLocations:[]
}

export default function(state = initialState, action){

  let newState = Object.assign({}, state);

  switch (action.type){

  case 'UPDATE_WORD':
  break;

  case 'RECEIVE_DICTIONARY':
  break;

  case 'REMOVE_LETTER':
  break;
  }

  return newState;

}
