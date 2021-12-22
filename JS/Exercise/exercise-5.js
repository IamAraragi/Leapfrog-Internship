var arr = [{
    id: 1,
    name: 'John',
}, {
    id: 2,
    name: 'Mary',
}, {
    id: 3,
    name: 'Andrew',
}];

function sortBy(array, key) {
    let result = array;

    for(let i=0; i<result.length; i++){
        for(let j=0; j<result.length-i-1; j++)
        if (result[i][key] > result[j+1][key]){
            temp = result[i];
            result[i] = result[j+1];
            result[j+1] = temp;
        }
    }
    return result;
}

var sorted = sortBy(arr, 'name');

console.log(sorted)