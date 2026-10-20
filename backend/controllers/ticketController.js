const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

// Helper to generate unique readable ticket ID like TKT-1042
const generateTicketId = async () => {
  let unique = false;
  let ticketId = '';
  while (!unique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    ticketId = `TKT-${randomNum}`;
    const existing = await Ticket.findOne({ ticketId });
    if (!existing) {
      unique = true;
    }
  }
  return ticketId;
};

// @desc    Get all tickets (Customer gets own, Admin gets all)
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;

    const filter = {};

    // Customer can only view their own tickets (when authenticated as customer)
    if (req.user && req.user.role === 'customer') {
      filter.customer = req.user._id;
    }

    // Optional filters
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (priority && priority !== 'All') {
      filter.priority = priority;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Optional search across title or ticketId
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

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email role')
      .populate('department', 'name description');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Customer can only access their own ticket
    if (
      req.user.role !== 'admin' &&
      ticket.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied to this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new complaint ticket
// @route   POST /api/tickets
// @access  Private (Customer or Admin)
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

    const populated = await Ticket.findById(ticket._id).populate(
      'customer',
      'name email role'
    );

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a ticket (Customer can edit only when Open; Admin can update status & department)
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Rule: Closed tickets are read-only
    if (ticket.status === 'Closed') {
      return res.status(400).json({
        message: 'This ticket is Closed and cannot be modified.',
      });
    }

    // Customer Edit Rules
    if (req.user.role !== 'admin') {
      if (ticket.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Rule: Customer can only edit when ticket status is Open
      if (ticket.status !== 'Open') {
        return res.status(400).json({
          message: 'Customers can only edit tickets while their status is Open.',
        });
      }

      const { title, category, priority, description, screenshotUrl } = req.body;
      if (title) ticket.title = title.trim();
      if (category) ticket.category = category.trim();
      if (priority) ticket.priority = priority;
      if (description) ticket.description = description.trim();
      if (screenshotUrl !== undefined) ticket.screenshotUrl = screenshotUrl.trim();

      await ticket.save();
    } else {
      // Admin Edit Rules
      const { status, department, priority, category } = req.body;

      if (status) {
        // Enforce valid status
        const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: 'Invalid ticket status' });
        }

        // Track resolution time
        if (status === 'Resolved' && ticket.status !== 'Resolved') {
          ticket.resolvedAt = new Date();
        } else if (status !== 'Resolved' && ticket.status === 'Resolved') {
          ticket.resolvedAt = null;
        }

        ticket.status = status;
      }

      if (department !== undefined) {
        ticket.department = department ? department : null;
      }

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

// @desc    Reopen a resolved ticket (Allowed only once per assignment rules)
// @route   POST /api/tickets/:id/reopen
// @access  Private
const reopenTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Ownership check for customers
    if (
      req.user.role !== 'admin' &&
      ticket.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Rule: Must be Resolved to be reopened
    if (ticket.status !== 'Resolved') {
      return res.status(400).json({
        message: 'Only Resolved tickets can be reopened.',
      });
    }

    // Rule: Reopen only allowed once
    if (ticket.reopenCount >= 1) {
      return res.status(400).json({
        message: 'This ticket has already been reopened once and cannot be reopened again.',
      });
    }

    ticket.status = 'Open';
    ticket.reopenCount = ticket.reopenCount + 1;
    ticket.resolvedAt = null;

    await ticket.save();

    // Create an automatic comment indicating reopening
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

// @desc    Delete a ticket (Customer can delete only when Open)
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Customer check
    if (req.user.role !== 'admin') {
      if (ticket.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Rule: Customer can delete only while status is Open
      if (ticket.status !== 'Open') {
        return res.status(400).json({
          message: 'Customers can only delete tickets while their status is Open.',
        });
      }
    }

    // Delete associated comments
    await Comment.deleteMany({ ticket: ticket._id });
    await ticket.deleteOne();

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  reopenTicket,
  deleteTicket,
};
