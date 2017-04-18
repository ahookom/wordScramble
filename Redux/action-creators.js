

export function seedWord(word){
  return {
    type: 'SEED_WORD',
    word
  }
}

export function setOriginalWord(word){
  return {
    type: 'SET_ORIGINAL_WORD',
    word
  }
}

export function clearMostRecentCards(){
  return {
    type: 'CLEAR_RECENT_CARDS'
  }
}

export function cycleMode(mode = 'NEXT'){
  return {
    type: 'CHANGE_MODE',
    mode
  }
}

export function removeLetter(index){
  return {
    type: 'REMOVE_LETTER',
    index
  }
}

export function setCardLocation(letter, layout){
  return {
    type: 'SET_CARD_LOCATION',
    layout,
    letter
  }
}

export function updateWordAndRemoveCard(word,str,index){
  if (!(index+1))index = Infinity;
  return {
    type: 'UPDATE_WORD',
    word,
    card: {str, index}
  }
}

export function addPlayerCard(card){
  return {
    type: 'ADD_PLAYER_CARD',
    card
  }
}

export function setTargetWord(word){
  return {
    type: 'SET_TARGET_WORD',
    target: word
  }
}

export function setPlayerCards(array){
  return {
    type: 'SET_PLAYER_CARDS',
    cards: array
  }
}

export function setDropLocation(index,layout){
  return {
    type: 'SET_DROP_LOCATION',
    layout,
    index
  }
}
