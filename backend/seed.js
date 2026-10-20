const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Department = require('./models/Department');
const Ticket = require('./models/Ticket');
const Comment = require('./models/Comment');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany();
    await Department.deleteMany();
    await Ticket.deleteMany();
    await Comment.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({ name: 'Admin User', email: 'admin@helpdesk.com', password: adminPassword, role: 'admin' });
    const user1 = await User.create({ name: 'John Doe', email: 'john@example.com', password: userPassword, role: 'customer' });
    const user2 = await User.create({ name: 'Sarah Connor', email: 'sarah@example.com', password: userPassword, role: 'customer' });
    const user3 = await User.create({ name: 'Alex Rivera', email: 'alex@example.com', password: userPassword, role: 'customer' });

    const d1 = await Department.create({ name: 'Technical Support', description: 'Software and system errors' });
    const d2 = await Department.create({ name: 'Billing & Accounts', description: 'Payments and invoices' });
    const d3 = await Department.create({ name: 'Customer Service', description: 'General customer queries' });
    const d4 = await Department.create({ name: 'IT Infrastructure', description: 'VPN, network, and hardware' });

    const hoursAgo = (h) => new Date(Date.now() - h * 3600000);

    const sampleTickets = [
      { ticketId: 'TKT-1001', title: 'VPN login failing on macOS', category: 'Technical', priority: 'High', description: 'Receiving Error 403 authorization failed on VPN.', customer: user1._id, department: d4._id, status: 'Open', createdAt: hoursAgo(24) },
      { ticketId: 'TKT-1002', title: 'Billed twice for subscription', category: 'Billing', priority: 'High', description: 'Duplicate charge of $120 on invoice INV-9821.', customer: user2._id, department: d2._id, status: 'In Progress', createdAt: hoursAgo(18) },
      { ticketId: 'TKT-1003', title: 'Sticky spacebar on laptop', category: 'Hardware', priority: 'Low', description: 'Laptop keys sticking and need servicing.', customer: user3._id, department: d1._id, status: 'Resolved', createdAt: hoursAgo(48), resolvedAt: hoursAgo(42) },
      { ticketId: 'TKT-1004', title: 'Password reset link expired', category: 'Account', priority: 'Medium', description: 'Token expires instantly upon receipt.', customer: user1._id, department: d3._id, status: 'Open', createdAt: hoursAgo(10) },
      { ticketId: 'TKT-1005', title: 'Second monitor request', category: 'Hardware', priority: 'Low', description: 'Need external display for testing.', customer: user2._id, department: d1._id, status: 'Closed', createdAt: hoursAgo(72), resolvedAt: hoursAgo(64) },
      { ticketId: 'TKT-1006', title: 'Stripe 3DS checkout timeout', category: 'Billing', priority: 'High', description: 'Card verification gets stuck in spinner.', customer: user3._id, department: d2._id, status: 'In Progress', createdAt: hoursAgo(14) },
      { ticketId: 'TKT-1007', title: '2FA SMS code delayed', category: 'Account', priority: 'High', description: 'SMS OTP delayed by 30 minutes.', customer: user1._id, department: d3._id, status: 'Resolved', createdAt: hoursAgo(30), resolvedAt: hoursAgo(27) },
      { ticketId: 'TKT-1008', title: 'PDF export broken characters', category: 'Technical', priority: 'Medium', description: 'Unicode font renders as boxes.', customer: user2._id, department: d1._id, status: 'Open', createdAt: hoursAgo(6) },
      { ticketId: 'TKT-1009', title: 'Change invoice billing address', category: 'Billing', priority: 'Low', description: 'Need address updated to Bangalore.', customer: user3._id, department: d2._id, status: 'Resolved', createdAt: hoursAgo(50), resolvedAt: hoursAgo(45) },
      { ticketId: 'TKT-1010', title: 'Slow dashboard loading', category: 'Technical', priority: 'Medium', description: 'Analytics takes 8s to render.', customer: user1._id, department: d4._id, status: 'In Progress', createdAt: hoursAgo(12) },
      { ticketId: 'TKT-1011', title: 'Team member onboarding query', category: 'General', priority: 'Low', description: 'How to add 5 new interns to team.', customer: user2._id, department: d3._id, status: 'Closed', createdAt: hoursAgo(90), resolvedAt: hoursAgo(86) },
      { ticketId: 'TKT-1012', title: 'Webhook API rate limited', category: 'Technical', priority: 'High', description: 'Sync job received 429 response.', customer: user3._id, department: d1._id, status: 'Open', createdAt: hoursAgo(2) }
    ];

    const created = await Ticket.insertMany(sampleTickets);

    await Comment.insertMany([
      { ticket: created[0]._id, user: admin._id, text: 'We verified your VPN access profile. Please try re-downloading.' },
      { ticket: created[0]._id, user: user1._id, text: 'Thank you, checking now.' },
      { ticket: created[1]._id, user: admin._id, text: 'Duplicate charge verified, refund initiated.' },
      { ticket: created[2]._id, user: admin._id, text: 'Keyboard serviced by technician.' }
    ]);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
