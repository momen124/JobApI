const express = require('express');
const router = express.Router();
const {updateUser} = require('../controllers/userController');
const authinticate = require('../middleware/authinticate');



router.patch('/updateUser',authinticate ,updateUser);

module.exports = router;