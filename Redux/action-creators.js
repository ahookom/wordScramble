

export function seedWord(word){
  return {
    type: 'SEED_WORD',
    word
  }
}

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
