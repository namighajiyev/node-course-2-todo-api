const {
    Todo
} = require("./../server/models/todo");
const {
    User
} = require("./../server/models/user");
const {
    mongoose
} = require("./../server/db/mongoose");

const id = "5a11b293f7c54e1f44d7e20b";
const userId = "5a0fe65d7463a01204023d7f";
const {
    ObjectID
} = require("mongodb");

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findByIdAndRemove("5a1441d67a4ca126e80e176b").then((todo) => {
//     console.log(todo);
// });

Todo.findOneAndRemove({
    _id: new ObjectID("5a1442b6b83eda2de80a2373")
}).then((todo) => {
    console.log(todo);
});