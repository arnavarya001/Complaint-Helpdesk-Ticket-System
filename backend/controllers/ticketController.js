const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

const getTickets = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const filter = {};
    if (req.user && req.user.role === 'customer') {
      filter.customer = req.user._id;
    }
    if (status && status !== 'All') filter.status = status;
    if (priority && priority !== 'All') filter.priority = priority;
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { ticketId: { $regex: search.trim(), $options: 'i' } },
      ];
    }
    const tickets = await Ticket.find(filter)
      .populate('customer', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('department', 'name');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { title, category, priority, description, screenshotUrl } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description are required' });
    const count = await Ticket.countDocuments();
    const ticketId = `TKT-${1000 + count + 1}`;
    const ticket = await Ticket.create({
      ticketId,
      title,
      category: category || 'General',
      priority: priority || 'Medium',
      description,
      screenshotUrl: screenshotUrl || '',
      customer: req.user._id,
      status: 'Open',
    });
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.status === 'Closed') {
      return res.status(400).json({ message: 'Closed tickets cannot be modified.' });
    }
    if (req.user.role !== 'admin') {
      if (ticket.status !== 'Open') {
        return res.status(400).json({ message: 'Can only edit tickets while Open' });
      }
      const { title, category, priority, description, screenshotUrl } = req.body;
      if (title) ticket.title = title;
      if (category) ticket.category = category;
      if (priority) ticket.priority = priority;
      if (description) ticket.description = description;
      if (screenshotUrl !== undefined) ticket.screenshotUrl = screenshotUrl;
    } else {
      const { status, department, priority } = req.body;
      if (status) {
        if (status === 'Resolved' && ticket.status !== 'Resolved') ticket.resolvedAt = new Date();
        ticket.status = status;
      }
      if (department !== undefined) ticket.department = department ? department : null;
      if (priority) ticket.priority = priority;
    }
    await ticket.save();
    const updated = await Ticket.findById(ticket._id)
      .populate('customer', 'name email')
      .populate('department', 'name');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const reopenTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.status !== 'Resolved') {
      return res.status(400).json({ message: 'Only Resolved tickets can be reopened.' });
    }
    if (ticket.reopenCount >= 1) {
      return res.status(400).json({ message: 'Ticket can only be reopened once.' });
    }
    ticket.status = 'Open';
    ticket.reopenCount += 1;
    ticket.resolvedAt = null;
    await ticket.save();
    await Comment.create({
      ticket: ticket._id,
      user: req.user._id,
      text: 'Ticket reopened. Status changed back to Open.',
    });
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (req.user.role !== 'admin' && ticket.status !== 'Open') {
      return res.status(400).json({ message: 'Can only delete Open tickets' });
    }
    await Comment.deleteMany({ ticket: ticket._id });
    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTickets, getTicketById, createTicket, updateTicket, reopenTicket, deleteTicket };
