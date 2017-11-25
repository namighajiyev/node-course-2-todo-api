const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
var password = "abc123"
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = "$2a$10$yhgB1dPKA7t7Dkktx207QuDExlA0gz0A/Q6kL7HaKhOolDVUofkmW";
bcrypt.compare(password , hashedPassword, (err, success) =>{
    console.log(success);
});
    


// var data = {
//     id: 10
// };
// var token = jwt.sign(data, 'abc123');
// console.log(token);
// var decoded = jwt.verify(token, 'abc123');
// console.log('decoded', decoded);