// controllers.js

 async function someAsyncDatabaseCall(entry) {
   var entry = "This is an Async Log Entry";
 // var data = entry;
  console.log(entry);
  return entry;
}





module.exports.getMyData = async (entry) => {
 // try {
 var entry = "This is an Async Log Entry";

  //  const data =
     await someAsyncDatabaseCall(entry);
   
  //  res.redirect('/data')
 // } catch (err) {
    // Crucial for async: pass errors to the next middleware
   // console.log(err); //console.log('Error');
 // }
}

