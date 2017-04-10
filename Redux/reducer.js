

let initialState={
  word:'',
  player_letters:[],
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
