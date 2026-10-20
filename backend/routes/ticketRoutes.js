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
const { verifyToken, optionalAuth } = require('../middleware/authHandler');

// GET /api/tickets is public/optionalAuth (allows browsing tickets without login)
// POST /api/tickets requires authentication
router.route('/')
  .get(optionalAuth, getTickets)
  .post(verifyToken, createTicket);

router.route('/:id')
  .get(optionalAuth, getTicketById)
  .put(verifyToken, updateTicket)
  .delete(verifyToken, deleteTicket);

router.post('/:id/reopen', verifyToken, reopenTicket);

module.exports = router;
