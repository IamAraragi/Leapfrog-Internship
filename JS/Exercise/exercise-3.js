var fruits = [
    {id: 1, name: 'Banana', color: 'Yellow'},
    {id: 2, name: 'Apple', color: 'Red'}
];

function searchByName(fruit, fruitName){
  for(let i=0; i<fruit.length; i++){
    if(fruit[i].name.toLowerCase() === fruitName.toLowerCase()){
      return fruit[i];
    }
  }
}

function searchByKey(fruit, key, fruitName){
  for(let i=0; i<fruit.length; i++){
    let keys = Object.keys(fruit[i]);
    if(keys.includes(key)){
      if(fruit[i][key].toLowerCase() === fruitName.toLowerCase()){
        return fruit[i];
      }
    }
  }
}


console.log(searchByName(fruits, 'apple'))
console.log(searchByKey(fruits, 'name', 'apple'));