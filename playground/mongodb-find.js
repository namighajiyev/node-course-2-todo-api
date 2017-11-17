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

    // db.collection('Todos').find({
    //     _id: new ObjectID("5a0d839b04d98e2b3c81d3cc")
    //     /*completed:false*/
    // }).toArray().then((docs) => {
    //         console.log("Todos");
    //         console.log(JSON.stringify(docs, undefined, 2));
    //         db.close();
    //     },
    //     (err) => {
    //         console.log("Unable to fetch todos", err);
    //     }
    // );
    db.collection('Todos').find().count().then((count) => {
            console.log(`Todos count: ${count}`);
            db.close();
        },
        (err) => {
            console.log("Unable to fetch todos", err);
        }
    );


});