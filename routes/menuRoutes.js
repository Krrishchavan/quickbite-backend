const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:restaurantId', menuController.getMenu);
router.post('/', authMiddleware, menuController.addMenuItem);

module.exports = router;
