var bcrypt = require('bcrypt-nodejs')

//Concept and code build from 
//https://stackoverflow.com/questions/43092071/how-should-i-store-salts-and-passwords-in-mongodb
//takes a text parameter and runs it through hashing protocols from bcrypt
//bcrypt provides it's own hashing salt
function hashpass(aPassword) {
    return bcrypt.hashSync(aPassword, bcrypt.genSaltSync(8), null);
}
//concept of calling using cli
//https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
//preforms a hash and gives the value to the console for the 
//DB admin to use in setting up new users.
process.argv.forEach(function (val, index, array) {
    rVal = hashpass(val)
    console.log(rVal)
})