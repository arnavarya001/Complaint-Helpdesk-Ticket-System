const Ticket = require('../models/Ticket');
const Department = require('../models/Department');
const User = require('../models/User');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openCount = await Ticket.countDocuments({ status: 'Open' });
    const inProgressCount = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedCount = await Ticket.countDocuments({ status: 'Resolved' });
    const closedCount = await Ticket.countDocuments({ status: 'Closed' });
    const priorityCounts = {
      Low: await Ticket.countDocuments({ priority: 'Low' }),
      Medium: await Ticket.countDocuments({ priority: 'Medium' }),
      High: await Ticket.countDocuments({ priority: 'High' }),
    };
    const categoryAggregation = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const categoryBreakdown = {};
    categoryAggregation.forEach((item) => {
      categoryBreakdown[item._id || 'Uncategorized'] = item.count;
    });
    const resolvedTickets = await Ticket.find({ resolvedAt: { $ne: null } }).select('createdAt resolvedAt');
    let avgResolutionHours = 0;
    if (resolvedTickets.length > 0) {
      const totalResolutionMs = resolvedTickets.reduce((acc, ticket) => {
        const diff = new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime();
        return acc + Math.max(0, diff);
      }, 0);
      avgResolutionHours = Number((totalResolutionMs / (resolvedTickets.length * 1000 * 60 * 60)).toFixed(1));
    }
    const totalDepartments = await Department.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const recentTickets = await Ticket.find()
      .populate('customer', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      summary: {
        totalTickets,
        openCount,
        inProgressCount,
        resolvedCount,
        closedCount,
        totalDepartments,
        totalCustomers,
        avgResolutionHours,
      },
      statusBreakdown: {
        Open: openCount,
        'In Progress': inProgressCount,
        Resolved: resolvedCount,
        Closed: closedCount,
      },
      priorityBreakdown: priorityCounts,
      categoryBreakdown,
      recentTickets,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
