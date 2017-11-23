const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const {
    isEmail
} = require("validator");

const _ = require("lodash");

var UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    return _.pick(user.toObject(), ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        id: user._id.toHexString(),
        access
    }, "abc123");
    user.tokens.push({
        access,
        token
    });
    return user.save().then(() => {
        return token;
    });

}

var User = mongoose.model("User", UserSchema);
module.exports = {
    User
};