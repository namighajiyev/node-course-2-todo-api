//const MongoClient = require("mongodb").MongoClient;
const {
    MongoClient,
    ObjectID
} = require("mongodb");
// var user = {name:"namiq" , age : 31};
// var {name , age} = user;
// console.log(name, age);

//  
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        return console.log('Unable connect to mongodb');
    }
    console.log('Connected to mongodb');

    // db.collection("Todos").insertOne({
    // text:"some todo",
    // completed:false
    // },
    // (err, result) => {
    //     if(err) { 
    //         return console.log("error at inserting todo", err);
    //     } 
    //     console.log(JSON.stringify(result , null , 2))
    // });


    // db.collection("Users").insertOne({
    //         name: "senan",
    //         age: 33,
    //         location: "baku"
    //     },
    //     (err, result) => {
    //         if (err) {
    //             return console.log("error at inserting todo", err);
    //         }
    //        console.log(JSON.stringify(result.ops, null, 2));
    //         //console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), null, 2));
    //     }
    // ); 

    db.close();

});