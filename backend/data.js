const tickets = [
  {
    id: 1,
    title: "Unable to access VPN when working remotely",
    description: "Receiving Error 403 authorization failed whenever connecting through Cisco AnyConnect on macOS. Certificate handshake fails repeatedly.",
    category: "Technical Support",
    price: 49,
    rating: 4.8,
    stock: 3,
    brand: "IT Infrastructure",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    title: "Billed twice for annual subscription renewal",
    description: "My credit card shows two identical charges of $120 on October 18th for invoice #INV-9821. Requesting an immediate refund for duplicate transaction.",
    category: "Billing & Accounts",
    price: 120,
    rating: 4.9,
    stock: 1,
    brand: "Finance Dept",
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    title: "Keyboard keys sticky on workstation laptop",
    description: "The spacebar and E key on the assigned ThinkPad laptop are sticking and require replacement by an authorized IT hardware technician.",
    category: "Hardware",
    price: 25,
    rating: 4.5,
    stock: 5,
    brand: "Hardware Logistics",
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    title: "Password reset link expires instantly",
    description: "When clicking the reset password link in my email, the website says token expired even within 1 minute of receiving the email.",
    category: "Account Security",
    price: 15,
    rating: 4.7,
    stock: 2,
    brand: "Customer Service",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    title: "Payment gateway timeout during checkout",
    description: "Customer reports that Stripe 3D Secure verification gets stuck in an infinite loading spinner during international card payments.",
    category: "Billing & Accounts",
    price: 85,
    rating: 4.6,
    stock: 4,
    brand: "Finance Dept",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    title: "Export to PDF report displays corrupted fonts",
    description: "When downloading monthly complaint audit summaries as PDF, Unicode Hindi characters render as empty rectangular boxes.",
    category: "Software Bug",
    price: 35,
    rating: 4.3,
    stock: 7,
    brand: "Software Engineering",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    title: "Two-factor authentication SMS delayed",
    description: "OTP SMS verification messages are delayed by over 25 minutes during peak working hours, preventing team members from logging in.",
    category: "Account Security",
    price: 20,
    rating: 4.4,
    stock: 2,
    brand: "Customer Service",
    thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    title: "Slow dashboard response times on analytics",
    description: "Loading the tickets metrics dashboard takes upwards of 8 seconds when calculating resolution SLAs and open queue counts.",
    category: "Technical Support",
    price: 60,
    rating: 4.7,
    stock: 3,
    brand: "IT Infrastructure",
    thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60"
  }
];

module.exports = { tickets };
