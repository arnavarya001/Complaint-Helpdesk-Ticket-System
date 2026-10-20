const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  reopenTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { verifyToken } = require('../middleware/authHandler');

router.use(verifyToken);

router.route('/')
  .get(getTickets)
  .post(createTicket);

router.route('/:id')
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

router.post('/:id/reopen', reopenTicket);

module.exports = router;
