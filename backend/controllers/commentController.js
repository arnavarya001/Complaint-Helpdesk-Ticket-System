const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');

const getComments = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (req.user && req.user.role !== 'admin' && ticket.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const comments = await Comment.find({ ticket: ticketId })
      .populate('user', 'name role email')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (req.user.role !== 'admin' && ticket.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (ticket.status === 'Closed') {
      return res.status(400).json({ message: 'This ticket is Closed and cannot receive new comments.' });
    }
    const comment = await Comment.create({
      ticket: ticket._id,
      user: req.user._id,
      text: text.trim(),
    });
    const populated = await Comment.findById(comment._id).populate('user', 'name role email');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, addComment };
