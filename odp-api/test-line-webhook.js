const axios = require('axios');

async function testLineWebhook() {
  try {
    console.log('Testing LINE Webhook...');
    
    // Test help message
    const helpResponse = await axios.post('http://localhost:3000/line/webhook', {
      events: [{
        type: 'message',
        message: {
          type: 'text',
          text: 'help'
        },
        replyToken: 'test-reply-token',
        source: {
          userId: 'test-user-123'
        }
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Help message test:', helpResponse.data);
    
    // Test name search
    const searchResponse = await axios.post('http://localhost:3000/line/webhook', {
      events: [{
        type: 'message',
        message: {
          type: 'text',
          text: 'สมชาย ใจดี'
        },
        replyToken: 'test-reply-token-2',
        source: {
          userId: 'test-user-123'
        }
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Name search test:', searchResponse.data);
    
  } catch (error) {
    console.error('Error testing webhook:', error.response?.data || error.message);
  }
}

// Run the test
testLineWebhook();
