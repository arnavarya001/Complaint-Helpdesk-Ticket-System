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
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Department.deleteMany();
    await Ticket.deleteMany();
    await Comment.deleteMany();
    console.log('Cleared existing collections.');

    // Passwords hashing
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    // Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@helpdesk.com',
      password: adminPassword,
      role: 'admin',
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'customer',
    });

    const customer2 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: userPassword,
      role: 'customer',
    });

    const customer3 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: userPassword,
      role: 'customer',
    });

    console.log('Users created:');
    console.log(`- Admin: admin@helpdesk.com / admin123`);
    console.log(`- Customer: john@example.com / user123`);
    console.log(`- Customer: sarah@example.com / user123`);
    console.log(`- Customer: alex@example.com / user123`);

    // Create Departments
    const techDept = await Department.create({
      name: 'Technical Support',
      description: 'Hardware, software crashes, and network diagnostics',
    });

    const billingDept = await Department.create({
      name: 'Billing & Accounts',
      description: 'Invoices, refunds, payment gateway issues, and subscription billing',
    });

    const csDept = await Department.create({
      name: 'Customer Service',
      description: 'Account assistance, general inquiries, and user onboarding',
    });

    const infraDept = await Department.create({
      name: 'IT Infrastructure',
      description: 'Server access, VPN setup, hardware provisioning, and security permissions',
    });

    console.log('Departments created (4).');

    // Helper timestamp offsets
    const now = Date.now();
    const hoursAgo = (h) => new Date(now - h * 60 * 60 * 1000);

    // 12 Sample Tickets
    const sampleTickets = [
      {
        ticketId: 'TKT-1001',
        title: 'Unable to access VPN when working remotely',
        category: 'Technical',
        priority: 'High',
        description: 'Receiving Error 403 authorization failed whenever I connect through Cisco AnyConnect on macOS.',
        screenshotUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
        customer: customer1._id,
        department: infraDept._id,
        status: 'Open',
        reopenCount: 0,
        createdAt: hoursAgo(24),
      },
      {
        ticketId: 'TKT-1002',
        title: 'Billed twice for annual subscription renewal',
        category: 'Billing',
        priority: 'High',
        description: 'My credit card shows two identical charges of $120 on October 18th for invoice #INV-9821.',
        screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
        customer: customer2._id,
        department: billingDept._id,
        status: 'In Progress',
        reopenCount: 0,
        createdAt: hoursAgo(18),
      },
      {
        ticketId: 'TKT-1003',
        title: 'Keyboard keys sticky on workstation laptop',
        category: 'Hardware',
        priority: 'Low',
        description: 'The spacebar and E key on the assigned ThinkPad laptop are sticking and require replacement.',
        screenshotUrl: '',
        customer: customer3._id,
        department: techDept._id,
        status: 'Resolved',
        reopenCount: 0,
        createdAt: hoursAgo(48),
        resolvedAt: hoursAgo(42), // 6 hours resolution
      },
      {
        ticketId: 'TKT-1004',
        title: 'Password reset link expires instantly',
        category: 'Account',
        priority: 'Medium',
        description: 'When clicking the reset password link in my email, the website says token expired even within 1 minute.',
        screenshotUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
        customer: customer1._id,
        department: csDept._id,
        status: 'Open',
        reopenCount: 0,
        createdAt: hoursAgo(10),
      },
      {
        ticketId: 'TKT-1005',
        title: 'Request second external monitor for UI design work',
        category: 'Hardware',
        priority: 'Low',
        description: 'Requesting a 27-inch 4K monitor for dual display workspace to inspect responsive web layouts.',
        screenshotUrl: '',
        customer: customer2._id,
        department: techDept._id,
        status: 'Closed',
        reopenCount: 0,
        createdAt: hoursAgo(72),
        resolvedAt: hoursAgo(64), // 8 hours resolution
      },
      {
        ticketId: 'TKT-1006',
        title: 'Payment gateway timeout during checkout',
        category: 'Billing',
        priority: 'High',
        description: 'Customer reports that Stripe 3D Secure verification gets stuck in infinite loading spinner.',
        screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600',
        customer: customer3._id,
        department: billingDept._id,
        status: 'In Progress',
        reopenCount: 0,
        createdAt: hoursAgo(14),
      },
      {
        ticketId: 'TKT-1007',
        title: 'Two-factor authentication SMS not arriving',
        category: 'Account',
        priority: 'High',
        description: 'OTP SMS is delayed by over 30 minutes on Airtel telecom network in New Delhi region.',
        screenshotUrl: '',
        customer: customer1._id,
        department: csDept._id,
        status: 'Resolved',
        reopenCount: 0,
        createdAt: hoursAgo(30),
        resolvedAt: hoursAgo(27), // 3 hours resolution
      },
      {
        ticketId: 'TKT-1008',
        title: 'Export to PDF report displays corrupted fonts',
        category: 'Technical',
        priority: 'Medium',
        description: 'When downloading monthly analytics summary as PDF, Unicode Hindi characters render as square boxes.',
        screenshotUrl: '',
        customer: customer2._id,
        department: techDept._id,
        status: 'Open',
        reopenCount: 0,
        createdAt: hoursAgo(6),
      },
      {
        ticketId: 'TKT-1009',
        title: 'Update business invoice billing address',
        category: 'Billing',
        priority: 'Low',
        description: 'Please change our registered tax invoice address to our new office location in Bangalore.',
        screenshotUrl: '',
        customer: customer3._id,
        department: billingDept._id,
        status: 'Resolved',
        reopenCount: 0,
        createdAt: hoursAgo(50),
        resolvedAt: hoursAgo(45), // 5 hours resolution
      },
      {
        ticketId: 'TKT-1010',
        title: 'Slow page load times on dashboard analytics',
        category: 'Technical',
        priority: 'Medium',
        description: 'Loading the analytics chart page takes over 8 seconds during peak afternoon hours.',
        screenshotUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        customer: customer1._id,
        department: infraDept._id,
        status: 'In Progress',
        reopenCount: 0,
        createdAt: hoursAgo(12),
      },
      {
        ticketId: 'TKT-1011',
        title: 'General onboarding inquiry for team seats',
        category: 'General',
        priority: 'Low',
        description: 'How do we invite 5 new interns into our team workspace with restricted viewing permissions?',
        screenshotUrl: '',
        customer: customer2._id,
        department: csDept._id,
        status: 'Closed',
        reopenCount: 0,
        createdAt: hoursAgo(90),
        resolvedAt: hoursAgo(86), // 4 hours resolution
      },
      {
        ticketId: 'TKT-1012',
        title: 'API Rate limit exceeded on reporting webhook',
        category: 'Technical',
        priority: 'High',
        description: 'Our automated nightly sync received HTTP 429 Too Many Requests response starting midnight.',
        screenshotUrl: '',
        customer: customer3._id,
        department: techDept._id,
        status: 'Open',
        reopenCount: 0,
        createdAt: hoursAgo(2),
      },
    ];

    const createdTickets = await Ticket.insertMany(sampleTickets);
    console.log(`Created ${createdTickets.length} sample tickets.`);

    // Add sample comments to tickets
    const sampleComments = [
      {
        ticket: createdTickets[0]._id,
        user: admin._id,
        text: 'Hello John, we have verified your VPN certificate. Please re-download the profile from the intranet portal.',
      },
      {
        ticket: createdTickets[0]._id,
        user: customer1._id,
        text: 'Thank you! Trying that now, will update if it still throws 403.',
      },
      {
        ticket: createdTickets[1]._id,
        user: admin._id,
        text: 'We found the duplicate charge in our Stripe records. A refund for $120 has been initiated.',
      },
      {
        ticket: createdTickets[2]._id,
        user: admin._id,
        text: 'Workstation laptop keyboard was serviced and keys were replaced by IT technician.',
      },
    ];

    await Comment.insertMany(sampleComments);
    console.log('Sample comments added.');

    console.log('--- DATABASE SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
