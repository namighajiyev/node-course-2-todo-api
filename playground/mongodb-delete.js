const {
    MongoClient,
    ObjectID
} = require("mongodb");

//  
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        return console.log('Unable connect to mongodb');
    }
    console.log('Connected to mongodb');
    //deleteMany
    // db.collection("Todos").deleteMany({
    //     text: "Eat lunch"
    // }).then((result) => {
    //     db.close();
    //     console.log(result);
    // });

    //deleteOne
    // db.collection("Todos").deleteOne({
    //     text: "Eat lunch"
    // }).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete
    // db.collection("Todos").findOneAndDelete({
    //    completed:false
    // }).then((result) => {
    //     console.log(result);
    // });


    // db.collection("Users").findOneAndDelete({
    //    _id:new ObjectID("5a0e7c3ac4c2690220e987bb")
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection("Users").deleteMany({
        name: "senan"
    }).then((result) => {
        console.log(result);
    });
});