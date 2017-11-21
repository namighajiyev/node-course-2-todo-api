const {
    Todo
} = require("./../server/models/todo");
const {
    User
} = require("./../server/models/user");
const {
    mongoose
} = require("./../server/db/mongoose");

const id = "5a11b293f7c54e1f44d7e20bc";
const userId = "5a0fe65d7463a01204023d7f";

const {ObjectID} = require("mongodb");

if(!ObjectID.isValid(id)) {
    console.log("Object id is not valid!")
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log(todos);
// }).catch((e)=> console.log(e));;

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log(todo);
// }).catch((e)=> console.log(e));;

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log("Id not found");
//     }
//     console.log(todo);
// }).catch((e)=> console.log(e));

User.findById(userId).then((user) => {
    if(!user) {
        return console.log("Id not found");
    }
    console.log(user);
}).catch((e)=> console.log(e));