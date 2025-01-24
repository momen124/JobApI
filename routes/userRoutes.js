const express = require('express');
const router = express.Router();
const {updateUser} = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');



router.patch('/updateUser',authenticate ,updateUser);

module.exports = router;