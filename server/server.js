const express = require("express");
const bodyParser = require("body-parser");
const {
    mongoose
} = require("./db/mongoose");
const {
    User
} = require("./models/user");
const {
    Todo
} = require("./models/todo");

const {
    ObjectID
} = require("mongodb");

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get("/todos/:id", (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: "Invalid id"
        });
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                message: "Todo not found"
            });
        }
        res.send({
            todo
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete("/todos/:id", (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: "Invalid id"
        });
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            res.status(404).send({
                message: "Todo not found"
            });
        }
        res.send(todo);
    }).catch((err) => {
        res.status(400).send(err);
    });

});




app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
module.exports = {
    app
}