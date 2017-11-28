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
const {
    User
} = require("./../models/user");

const {
    mongoose
} = require("./../db/mongoose");

const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
                text: text,
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
                text: text,
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

describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done)
    });

    it("should return 401 if not autheticated", (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    });
});


describe("POST /users", () => {
    it("should create a user", (done) => {
        var email = "example@example.com";
        var password = "123sxss";
        request(app)
            .post("/users")
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({
                    email
                }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
            });
    });

    it("should return validation errors if request invalid", (done) => {
        request(app)
            .post("/users")
            .send({
                email: 'aaa',
                password: '123'
            })
            .expect(400)
            .end(done);
    });
    it("should not create user if email is in use", (done) => {
        request(app)
            .post("/users")
            .send({
                email: users[0].email,
                password: "dddd114r!"
            })
            .expect(400)
            .end(done)
    });
});

describe("POST /users/login", () => {
    it("should login user and return auth token", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it("should reject invalid login", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password + "1"
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e))

            });

    });
});

after(function () {
    mongoose.disconnect().then().catch(e => {
        console.log("Error at teardown closing mongoose", err);
    });

});