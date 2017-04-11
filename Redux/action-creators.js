

export function setCardLocation(letter, layout){
  return {
    type: 'SET_CARD_LOCATION',
    layout,
    letter
  }
}

export function updateWordAndRemoveCard(word,card){
  return {
    type: 'UPDATE_WORD',
    word,
    card
  }
}

export function addPlayerCard(card){
  return {
    type: 'ADD_PLAYER_CARD',
    card
  }
}

export function setDropLocation(index,layout){
  return {
    type: 'SET_DROP_LOCATION',
    layout,
    index
  }
}
