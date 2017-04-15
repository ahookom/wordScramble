import Dictionary from '../Dictionary/Dictionary.js';
import wordlist from '../Dictionary/wordlist.js';
import commonWordList from '../Dictionary/commonwordlist.js';

const LETTER_FREQUENCIES = {
  A: 8.12,
  B: 1.49,
  C: 2.71,
  D: 4.32,
  E: 12.02,
  F: 2.30,
  G: 2.03,
  H: 5.92,
  I: 7.31,
  J: 0.10,
  K: 0.69,
  L: 3.98,
  M: 2.61,
  N: 6.95,
  O: 7.68,
  P: 1.82,
  Q: 0.11,
  R: 6.02,
  S: 6.28,
  T: 9.10,
  U: 2.88,
  V: 1.11,
  W: 2.09,
  X: 0.17,
  Y: 2.11,
  Z: 0.07
}

const LETTER_TABLE = [];

export const dictionary = new Dictionary;

dictionary.bulkAddWords(wordlist);

export function getPathStart(){
    let newCards=[];
    let newWord = randomWord();
    while (newCards.length < 10) {
      newCards.push(getNewCard(newCards, newWord, []));
    }
    return {newWord, newCards};
}

export function getStandardStart(){
    let newCards=[];
    let newWord = randomWord();
    while (newCards.length < 10) {
      newCards.push(getNewCard(newCards, newWord, []));
    }
    return {newWord, newCards};
}

export function randomWord() {
  let temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  while(temp.length!==4){
    temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  }
  return temp;
}

export function isValidWord(word) {
    return dictionary.search(word);
}

export function getNewCard(currentCards, word, mostRecent) {
  if(LETTER_TABLE.length===0)seedLetterTable();

  let invalid = currentCards.join('') + word + mostRecent.join('');

  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let pick = LETTER_TABLE[Math.floor(Math.random() * LETTER_TABLE.length)];

  while (invalid.includes(pick)) {
    pick = LETTER_TABLE[Math.floor(Math.random() * LETTER_TABLE.length)];
  }

  return pick;

}

export function seedLetterTable(){
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let letterArr = letters.split('');
  letterArr.forEach(letter=>{
    let desiredNumber = Math.round(LETTER_FREQUENCIES[letter]*100);
    while(desiredNumber){
      LETTER_TABLE.push(letter);
      desiredNumber--;
    }
  })
}


export function getPossibleWords() {
  let possibleWords = [];
  const word = this.state.word;
  const currentCards = this.state.playerCards;
  //try removing each letter
  for(let i = 0 ; i<word.length;i++){
    let newWord = word.slice(0,i)+word.slice(i+1);
    if(this.isValidWord(newWord)){
      possibleWords.push(newWord)
    }
  }
  //try adding each letter to each position
  currentCards.forEach(letter=>{
    for(let i = 0 ; i<=word.length;i++){
      let newWord = word.slice(0, i) + letter + word.slice(i);
      if(this.isValidWord(newWord)){
        possibleWords.push(newWord)
      }
    }
  })
  //try substituting each letter into each position
  currentCards.forEach(letter=>{
    for (let i = 0 ; i < word.length;i++){
      let newWord = word.slice(0,i) + letter + word.slice(i+1);
      if (this.isValidWord(newWord)){
        possibleWords.push(newWord)
      }
    }
  })

  return possibleWords;

}
