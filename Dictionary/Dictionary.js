function Dictionary(){
  this.trees={};
}

function Tree(letter){
  this.value = letter;
  this.children={};
}

Tree.prototype.addChild = function(letter){
  this.children[letter]=new Tree('null');
}
Tree.prototype.addChildren = function(letterArray){
  if(letterArray.length){
  let current = letterArray.shift();
  if(!this.children[current])this.children[current] = new Tree(current);
  this.children[current].addChildren(letterArray);
  }
}

Tree.prototype.search = function(letterArr){
  if(!letterArr.length)return true;
  let firstLetter = letterArr.shift();
  if(!this.children[firstLetter])return false;
  else{
    return this.children[firstLetter].search(letterArr);
  }
}

Dictionary.prototype.add = function(word){
  let letterArr = word.split('');
  let currentLetter = letterArr.shift();
  if(!this.trees[currentLetter])this.trees[currentLetter]=new Tree(currentLetter);
  this.trees[currentLetter].addChildren(letterArr);
}

Dictionary.prototype.bulkAdd = function(arrOfWords){
  arrOfWords.forEach(word=>this.add(word));
}

Dictionary.prototype.search = function(word){
  let letterArr = word.split('');
  let firstLetter = letterArr.shift();
  if(!this.trees[firstLetter])return false;
  else{
    return this.trees[firstLetter].search(letterArr);
  }
}


export default Dictionary;
