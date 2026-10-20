const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

const generateTicketId = async () => {
  let unique = false;
  let ticketId = '';
  while (!unique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    ticketId = `TKT-${randomNum}`;
    const existing = await Ticket.findOne({ ticketId });
    if (!existing) unique = true;
  }
  return ticketId;
};

const getTickets = async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = {};
    if (req.user && req.user.role === 'customer') {
      filter.customer = req.user._id;
    }
    if (status && status !== 'All') filter.status = status;
    if (priority && priority !== 'All') filter.priority = priority;
    if (category && category !== 'All') filter.category = category;
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { ticketId: { $regex: search.trim(), $options: 'i' } },
      ];
    }
    const tickets = await Ticket.find(filter)
      .populate('customer', 'name email role')
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
      .populate('customer', 'name email role')
      .populate('department', 'name description');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (req.user && req.user.role !== 'admin' && ticket.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this ticket' });
    }
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { title, category, priority, description, screenshotUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const ticketId = await generateTicketId();
    const ticket = await Ticket.create({
      ticketId,
      title: title.trim(),
      category: category ? category.trim() : 'General',
      priority: priority || 'Medium',
      description: description.trim(),
      screenshotUrl: screenshotUrl ? screenshotUrl.trim() : '',
      customer: req.user._id,
      status: 'Open',
    });
    const populated = await Ticket.findById(ticket._id).populate('customer', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (ticket.status === 'Closed') {
      return res.status(400).json({ message: 'This ticket is Closed and cannot be modified.' });
    }
    if (req.user.role !== 'admin') {
      if (ticket.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (ticket.status !== 'Open') {
        return res.status(400).json({ message: 'Customers can only edit tickets while their status is Open.' });
      }
      const { title, category, priority, description, screenshotUrl } = req.body;
      if (title) ticket.title = title.trim();
      if (category) ticket.category = category.trim();
      if (priority) ticket.priority = priority;
      if (description) ticket.description = description.trim();
      if (screenshotUrl !== undefined) ticket.screenshotUrl = screenshotUrl.trim();
      await ticket.save();
    } else {
      const { status, department, priority, category } = req.body;
      if (status) {
        const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: 'Invalid ticket status' });
        }
        if (status === 'Resolved' && ticket.status !== 'Resolved') {
          ticket.resolvedAt = new Date();
        } else if (status !== 'Resolved' && ticket.status === 'Resolved') {
          ticket.resolvedAt = null;
        }
        ticket.status = status;
      }
      if (department !== undefined) ticket.department = department ? department : null;
      if (priority) ticket.priority = priority;
      if (category) ticket.category = category.trim();
      await ticket.save();
    }
    const updated = await Ticket.findById(ticket._id)
      .populate('customer', 'name email role')
      .populate('department', 'name');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const reopenTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (req.user.role !== 'admin' && ticket.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (ticket.status !== 'Resolved') {
      return res.status(400).json({ message: 'Only Resolved tickets can be reopened.' });
    }
    if (ticket.reopenCount >= 1) {
      return res.status(400).json({ message: 'This ticket has already been reopened once and cannot be reopened again.' });
    }
    ticket.status = 'Open';
    ticket.reopenCount = ticket.reopenCount + 1;
    ticket.resolvedAt = null;
    await ticket.save();
    await Comment.create({
      ticket: ticket._id,
      user: req.user._id,
      text: `Ticket reopened by ${req.user.name}. Status reverted to Open.`,
    });
    const updated = await Ticket.findById(ticket._id)
      .populate('customer', 'name email role')
      .populate('department', 'name');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (req.user.role !== 'admin') {
      if (ticket.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (ticket.status !== 'Open') {
        return res.status(400).json({ message: 'Customers can only delete tickets while their status is Open.' });
      }
    }
    await Comment.deleteMany({ ticket: ticket._id });
    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTickets, getTicketById, createTicket, updateTicket, reopenTicket, deleteTicket };
