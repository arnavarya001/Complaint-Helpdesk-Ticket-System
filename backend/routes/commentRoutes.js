const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authHandler');

router.use(verifyToken);

router.route('/ticket/:ticketId')
  .get(getComments)
  .post(addComment);

module.exports = router;
