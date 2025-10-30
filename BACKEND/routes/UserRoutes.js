const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {completeInfo} = require('../controllers/completeInfoController');


// Protect these routes later with your auth middleware
router.get('/profile', userController.getUserProfile);
router.put('/profile',userController.updateUserProfile);
router.delete('/delete-account', userController.deleteAccount);
router.post('/complete-info',completeInfo);

module.exports = router;
