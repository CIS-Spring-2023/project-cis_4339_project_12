const express = require('express')
const router = express.Router()
var bcrypt = require('bcrypt-nodejs')

// importing data model schemas
const { users } = require('../models/models')

//Attempt login
router.post('/', async (req, res, next) => {
  uName = req.body.uName;
  pWord = req.body.pWord;
  //variable used to confirm editor privilages
  let vEditor = false;
  //preform search for user
  users.findOne({ 'username': uName }, function (er, data) {
    if (er) {
      console.log('Error:' + err);
    }
    if (data != null) {
      //store hashed passwords from server and user and convert to  
      //string variables for comparison
      databaseCheck = "" + data.password
      hashedPassword = "" + pWord
      //store the role parameter
      let dRole = data.role
      if (hasPwordCompare(pWord, databaseCheck)) {
        let cRole = "" + dRole
        //verify editor
        if (cRole.toLowerCase() === 'editor') {
          vEditor = true
        }
        //create the result set with username, validation confirmation, and editor status
        res.json({ username: uName, isValidated: true, isEditor: vEditor })
      } else {
        res.json({ username: null, isValidated: false, isEditor: vEditor })
      }
    }
  });
})
//A function that utilizes bcrypt to compare hash passwords
function hasPwordCompare(pWord1, pWord2) {
  try {
    return bcrypt.compareSync(pWord1, pWord2)
  } catch (error) {
    console.log(error)
  }

}

module.exports = router

