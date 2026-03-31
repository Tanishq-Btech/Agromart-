const simulateChatResponse = (message) => {
  const lowercaseMsg = message.toLowerCase();

  // Keyword-based responses
  if (lowercaseMsg.includes('add a product') || lowercaseMsg.includes('add product')) {
    return "To add a product, log in to your Farmer Dashboard, navigate to 'My Products', and click the 'Add New Product' button. Fill in the agricultural details and upload an image.";
  }
  if (lowercaseMsg.includes('register') || lowercaseMsg.includes('sign up')) {
    return "You can register as a Consumer or a Farmer. Click 'Register' at the top right, select your role, and fill out the details. Farmers will need to verify their documents.";
  }
  if (lowercaseMsg.includes('delivery') || lowercaseMsg.includes('shipping')) {
    return "Delivery times depend on the farmer's location, but we typically aim for 1-3 business days for fresh produce.";
  }
  if (lowercaseMsg.includes('payment') || lowercaseMsg.includes('pay')) {
    return "We accept all major Credit/Debit Cards, UPI, and Net Banking for seamless transactions.";
  }
  if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
    return "Hello! I'm AgroAssist, your virtual farming helper. How can I assist you today?";
  }
  if (lowercaseMsg.includes('help')) {
    return "I can help you with registration, adding products, understanding delivery, tracking orders, and more. Just ask me a specific question!";
  }
  if (lowercaseMsg.includes('refund') || lowercaseMsg.includes('return') || lowercaseMsg.includes('cancel')) {
    return "You can cancel your order before it ships from the 'My Orders' section. If you are not satisfied with your fresh products, please contact support within 24 hours of delivery for a return or refund.";
  }
  if (lowercaseMsg.includes('contact') || lowercaseMsg.includes('support') || lowercaseMsg.includes('customer service')) {
    return "You can reach our support team by emailing support@agromart.com or calling our toll-free number 1-800-AGROMART. We are available 24/7!";
  }
  if (lowercaseMsg.includes('quality') || lowercaseMsg.includes('organic') || lowercaseMsg.includes('fresh')) {
    return "AgroMart ensures high-quality produce by personally verifying our farmers. Many offer certified organic products, which are clearly labeled on their product pages.";
  }
  if (lowercaseMsg.includes('bulk') || lowercaseMsg.includes('wholesale')) {
    return "Yes, many farmers provide bulk discounts for wholesale purchases. Check the product details or contact the farmer directly through the platform.";
  }
  if (lowercaseMsg.includes('track') || lowercaseMsg.includes('order status') || lowercaseMsg.includes('where is my order')) {
    return "You can track your order status in real-time by visiting the 'My Orders' section in your dashboard. You will see a visual timeline from placement to delivery.";
  }
  if (lowercaseMsg.includes('password') || lowercaseMsg.includes('forgot')) {
    return "If you've forgotten your password, click the 'Forgot Password' link on the login page to receive a reset link via email.";
  }

  // Fallback randomized response
  const fallbacks = [
    "I'm an AI assistant in training. Could you rephrase your question regarding AgroMart?",
    "That's an interesting question! For detailed support, please visit our Help Center.",
    "I'm not exactly sure about that. Try asking me about adding products or registration instead!"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

const simulateDocumentVerification = () => {
  // Simulate AI processing delay and randomized outcome
  // 90% chance of approval to make testing easier
  const isApproved = Math.random() < 0.9;
  
  if (isApproved) {
    return {
      status: 'approved',
      confidenceScore: (Math.random() * (99.9 - 95.0) + 95.0).toFixed(1), // 95.0% - 99.9%
      message: 'Documents verified successfully. All details match.'
    };
  } else {
    // Rejection reasons
    const reasons = ['Image blurred', 'Name mismatch', 'Document expired'];
    return {
      status: 'rejected',
      confidenceScore: (Math.random() * (60.0 - 30.0) + 30.0).toFixed(1), // 30.0% - 60.0%
      message: `Verification failed: ${reasons[Math.floor(Math.random() * reasons.length)]}`
    };
  }
};

module.exports = {
  simulateChatResponse,
  simulateDocumentVerification
};
