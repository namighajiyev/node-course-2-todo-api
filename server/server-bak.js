const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var TodoModel = mongoose.model("Todo", {
    text: {
        type: String,
        required:true,
        minlength:1,
        trim:true
    },
    completed: {
        type: Boolean,
        default : false
    },
    completedAt: {
        type: Number,
        default :null
    }
});

var UserModel = mongoose.model("User", {
    email: {
        type : String,
        required : true,
        minlength:1,
        trim:true
    }
});

var newUser =  new UserModel({
email:"namiq886@gmail.com"
});
newUser.save().then((result) => {
    console.log("Saved user", result );
    }, (error) => {
        console.log("Unable save user", error );
    });


// var newTodo = new TodoModel({
//      text: "  Go to dentist "//,
//     //completed:true,
//    // completedAt:new Date().getTime()
// });

// newTodo.save().then((result) => {
// console.log("Saved todo", result );
// }, (error) => {
//     console.log("Unable save todo", error );
// });