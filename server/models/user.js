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
        _id: user._id.toHexString(),
        access
    }, "abc123");
    user.tokens.push({
        access,
        token
    });
    return user.save().then(() => {
        return token;
    });

};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, "abc123");
    } catch (error) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

}


var User = mongoose.model("User", UserSchema);
module.exports = {
    User
};