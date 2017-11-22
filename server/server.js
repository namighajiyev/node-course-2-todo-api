require('./config/config');
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
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

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((todo) => {
        res.send({
            todo
        });
    }).catch((error) => {
        res.status(400).send({
            error
        });
    });
});

app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }).catch((error) => {
        res.status(400).send({
            error
        });
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
    }).catch((error) => {
        res.status(400).send({
            error
        });
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
            return res.status(404).send({
                message: "Todo not found"
            });
        }
        res.send({
            todo
        });
    }).catch((error) => {
        res.status(400).send({
            error
        });
    });

});

app.patch("/todos/:id", (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: "Invalid id"
        });
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                message: "Todo not found"
            });
        }
        res.send({
            todo
        });
    }).catch((error) => {
        res.status(400).send({
            error
        });
    });

});




app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
module.exports = {
    app
}