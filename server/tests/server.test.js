const expect = require("expect");
const request = require("supertest");
const {
    ObjectID
} = require("mongodb");
const {
    app
} = require("./../server");
const {
    Todo
} = require("./../models/todo");

const todos = [{
    _id: new ObjectID(),
    text: "First todo text"
}, {
    _id: new ObjectID(),
    text: "Second todo text",
    completed: true,
    completedAt: 333
}];
const {
    mongoose
} = require("./../db/mongoose");


beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
});

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        var text = "Test todo text";
        request(app)
            .post("/todos")
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            })
    });


    it("should not create todo with invalid body data", (done) => {
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            });
    });

});

describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should return 404 error if invalid id is passed", (done) => {
        request(app).get("/todos/foo")
            .expect(404)
            .end(done)
    });
    it("should return 404 error if todo doesn't exists by given valid id", (done) => {
        request(app)
            .get("/todos/5a0fe65d7463a01204023d7f")
            .expect(404)
            .expect((err) => {
                expect(err.body.message).toBe("Todo not found");
            })
            .end(done);
    });
    it("should get a todo", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)
    });
});
describe("DELETE /todos/:id", () => {
    it("should delete a todo", (done) => {
        var id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch(err => done(err));
            });
    });

    it("should return 404 status if id is invalid", (done) => {
        request(app)
            .delete("/todos/someinvalidid")
            .expect(404)
            .end(done);
    });

    it("should return 404 if to do with given valid id doesn't exists", (done) => {
        request(app).delete("/todos/5a0fe65d7463a01204023d7f")
            .expect(404)
            .expect((err) => {
                expect(err.body.message).toBe("Todo not found");
            })
            .end(done);
    });

});

describe("PATCH /todos/:id", () => {

    it("should update completed to false", (done) => {
        var id = todos[1]._id.toHexString();
        var text = "dummy todo asdadas 6987546213489"
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text : text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
                expect(res.body.todo.text).toBe(text);
            })
            .end(done);
    });

    it("should update text and set completed to true", (done) => {
        var id = todos[1]._id.toHexString();
        var text = "dummy todo asdadas 6987546213489"
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text : text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number')
                expect(res.body.todo.completedAt).toNotBe(todos[1].completedAt);
                expect(res.body.todo.text).toBe(text);
            })
            .end(done);
    });
});

after(function () {
    mongoose.disconnect().then().catch(e => {
        console.log("Error at teardown closing mongoose", err);
    });

});