let student = {
    name:"Abhishek Shrestha",
    address: "Kathmandu",
    emails: "abc@gmail.com",
    interests: "Basketball",
    education: [{
      name: "ABC School of Schoolery",
      enrolledDate: "2000"
    },
    {
      name: "BCD School of Trickery",
      enrolledDate: "2006"
    }]
  };
  
  // student.education.forEach(printList);
  
  // function printList(value){
  //   console.log('Name:'+value.name+',Date:'+value.enrolledDate)
  // }
  
  for(let i=0; i<student.education.length; i++){
    console.log('Name:'+student.education[i].name+',Date:'+student.education[i].enrolledDate);
  }