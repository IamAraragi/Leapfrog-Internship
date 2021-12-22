function renderPattern(number){
    let pattern = '*';
  
    for (var i=number; i>0; i--){
      console.log(pattern.repeat(i))
    }
  }
  
  renderPattern(7)