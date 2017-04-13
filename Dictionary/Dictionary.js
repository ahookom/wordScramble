function Tree(){
  this.endOfWord = false;
  this.children = {};
}

Tree.prototype.addChild = function(letter){
  this.children[letter] = new Tree();
}
Tree.prototype.addChildren = function(letterArray){
  if (!letterArray.length) this.endOfWord = true;
  if (letterArray.length){
    let current = letterArray.shift();
    if (!this.children[current]) this.children[current] = new Tree();
    this.children[current].addChildren(letterArray);
  }
}

Tree.prototype.searchChildren = function(letterArr){
  let firstLetter = letterArr.shift();
  if (!this.children[firstLetter]){return false;}
  else {
    return letterArr.length ? this.children[firstLetter].searchChildren(letterArr) : this.children[firstLetter].endOfWord ;
  }
}

Tree.prototype.search = function(word){
  if (word.length) return this.searchChildren(word.split(''));
}

Tree.prototype.addWord = function(word){
  let letterArr = word.split('');
  let currentLetter = letterArr.shift();
  if (!this.children[currentLetter]) this.children[currentLetter] = new Tree();
  this.children[currentLetter].addChildren(letterArr);
}

Tree.prototype.bulkAddWords = function(arrOfWords){
  arrOfWords.forEach(word => this.addWord(word));
}

export default Tree;
