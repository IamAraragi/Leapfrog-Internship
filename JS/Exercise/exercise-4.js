var numbers = [1, 2, 3, 4];

function transform(collection, tranFunc) {
    let result = [];
    for(let i=0; i<collection.length; i++){
        result.push(tranFunc(collection[i]));
    }
    return result;
}

var output = transform(numbers, function(num) {
    return num * 2;
});

console.log(output);