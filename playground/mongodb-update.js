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
    // //todos
    // db.collection("Todos").findOneAndUpdate({
    //         _id: new ObjectID("5a0ee52991cda631ac455223")
    //     }, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false

    //     })
    //     .then((result) => {
    //         console.log(result);
    //     });

    db.collection("Users").findOneAndUpdate({
            _id: new ObjectID("5a0e7c56ce4eaa16107a7ba6")
        }, {
            $set: {
                name: "Namiq"
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        })
        .then((result) => {
            console.log(result);
        });

});