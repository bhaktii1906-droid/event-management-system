const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('Testing EventEaseWeb API...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthRes = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthRes.data);
    
    // Test 2: Get events
    console.log('\n2. Testing events endpoint...');
    const eventsRes = await axios.get(`${API_BASE_URL}/events`);
    console.log(`✅ Events found: ${eventsRes.data.events?.length || 0}`);
    
    // Test 3: Admin login
    console.log('\n3. Testing admin login...');
    try {
      const adminRes = await axios.post(`${API_BASE_URL}/admin/login`, {
        email: 'admin@example.com',
        password: 'Admin@123'
      });
      console.log('✅ Admin login successful');
      console.log('   Token:', adminRes.data.token.substring(0, 20) + '...');
      
      const adminToken = adminRes.data.token;
      
      // Test 4: Get admin stats
      console.log('\n4. Testing admin stats...');
      const statsRes = await axios.get(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Admin stats received');
      console.log('   Stats:', statsRes.data);
      
      // Test 5: Get all users
      console.log('\n5. Testing get all users...');
      const usersRes = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✅ Users found: ${usersRes.data.length}`);
      
      // Test 6: Get all bookings
      console.log('\n6. Testing get all bookings...');
      const bookingsRes = await axios.get(`${API_BASE_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✅ Bookings found: ${bookingsRes.data.length}`);
      
      // Test 7: Get all enquiries
      console.log('\n7. Testing get all enquiries...');
      const enquiriesRes = await axios.get(`${API_BASE_URL}/admin/enquiries`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✅ Enquiries found: ${enquiriesRes.data.length}`);
      
      // Test 8: Create event
      console.log('\n8. Testing create event...');
      const eventData = {
        title: 'Test Event ' + Date.now(),
        description: 'This is a test event',
        date: '2025-12-25',
        time: '10:00',
        end_time: '12:00',
        type: 'Workshop',
        location: 'Test Location',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
        capacity: 100,
        amenities: 'WiFi, Snacks'
      };
      
      const createEventRes = await axios.post(`${API_BASE_URL}/admin/events`, eventData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Event created:', createEventRes.data.message);
      
      // Test 9: Update event
      console.log('\n9. Testing update event...');
      if (eventsRes.data.events.length > 0) {
        const eventId = eventsRes.data.events[0].id;
        const updateRes = await axios.put(`${API_BASE_URL}/admin/events/${eventId}`, {
          title: 'Updated Event Title'
        }, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Event updated:', updateRes.data.message);
      }
      
      // Test 10: Delete event (commented out to avoid deleting real events)
      // console.log('\n10. Testing delete event...');
      // if (createEventRes.data.eventId) {
      //   const deleteRes = await axios.delete(`${API_BASE_URL}/admin/events/${createEventRes.data.eventId}`, {
      //     headers: { Authorization: `Bearer ${adminToken}` }
      //   });
      //   console.log('✅ Event deleted:', deleteRes.data.message);
      // }
      
    } catch (error) {
      console.log('❌ Admin test failed:', error.response?.data?.error || error.message);
    }
    
    // Test 11: User login
    console.log('\n11. Testing user login...');
    try {
      const userRes = await axios.post(`${API_BASE_URL}/login`, {
        email: 'user@example.com',
        password: 'User@123'
      });
      console.log('✅ User login successful');
      console.log('   Token:', userRes.data.token.substring(0, 20) + '...');
      
      const userToken = userRes.data.token;
      
      // Test 12: Get user profile
      console.log('\n12. Testing user profile...');
      const profileRes = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('✅ User profile received');
      
      // Test 13: Get upcoming events
      console.log('\n13. Testing upcoming events...');
      const upcomingRes = await axios.get(`${API_BASE_URL}/events/upcoming`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log(`✅ Upcoming events: ${upcomingRes.data.events?.length || 0}`);
      
      // Test 14: Create booking
      console.log('\n14. Testing create booking...');
      if (eventsRes.data.events.length > 0) {
        const eventId = eventsRes.data.events[0].id;
        const bookingData = {
          eventId: eventId,
          numberOfSeats: 2,
          attendeeDetails: [
            { name: 'Test Attendee 1', email: 'test1@example.com' },
            { name: 'Test Attendee 2', email: 'test2@example.com' }
          ]
        };
        
        const bookingRes = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('✅ Booking created:', bookingRes.data.message);
        
        // Test 15: Get user bookings
        console.log('\n15. Testing get user bookings...');
        const userBookings = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log(`✅ User bookings: ${userBookings.data.length}`);
        
        // Test 16: Cancel booking
        console.log('\n16. Testing cancel booking...');
        if (userBookings.data.length > 0) {
          const bookingId = userBookings.data[0].id;
          const cancelRes = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {}, {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          console.log('✅ Booking cancelled:', cancelRes.data.message);
        }
        
        // Test 17: Create enquiry
        console.log('\n17. Testing create enquiry...');
        const enquiryData = {
          eventId: eventId,
          message: 'This is a test enquiry about the event.'
        };
        
        const enquiryRes = await axios.post(`${API_BASE_URL}/enquiries`, enquiryData, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('✅ Enquiry created:', enquiryRes.data.message);
        
        // Test 18: Get user enquiries
        console.log('\n18. Testing get user enquiries...');
        const userEnquiries = await axios.get(`${API_BASE_URL}/enquiries/my-enquiries`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log(`✅ User enquiries: ${userEnquiries.data.length}`);
        
        // Test 19: Get notifications
        console.log('\n19. Testing get notifications...');
        const notificationsRes = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log(`✅ Notifications: ${notificationsRes.data.length}`);
        
        // Test 20: Mark notification as read
        console.log('\n20. Testing mark notification as read...');
        if (notificationsRes.data.length > 0) {
          const notifId = notificationsRes.data[0].id;
          const markReadRes = await axios.put(`${API_BASE_URL}/notifications/${notifId}/read`, {}, {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          console.log('✅ Notification marked as read:', markReadRes.data.message);
        }
        
        // Test 21: Update user profile
        console.log('\n21. Testing update user profile...');
        const updateProfileRes = await axios.put(`${API_BASE_URL}/profile`, {
          name: 'Updated User Name',
          mobile: '9876543219'
        }, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('✅ Profile updated:', updateProfileRes.data.message);
      }
      
    } catch (error) {
      console.log('❌ User test failed:', error.response?.data?.error || error.message);
    }
    
    // Test 22: User registration
    console.log('\n22. Testing user registration...');
    try {
      const registerData = {
        name: 'Test User ' + Date.now(),
        email: `test${Date.now()}@example.com`,
        mobile: '987654321' + Math.floor(Math.random() * 10),
        password: 'Test@123'
      };
      
      const registerRes = await axios.post(`${API_BASE_URL}/register`, registerData);
      console.log('✅ User registered:', registerRes.data.message);
    } catch (error) {
      console.log('❌ Registration test failed:', error.response?.data?.error || error.message);
    }
    
    // Test 23: Forgot password
    console.log('\n23. Testing forgot password...');
    try {
      const forgotRes = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: 'user@example.com'
      });
      console.log('✅ Forgot password:', forgotRes.data.message);
      console.log('   OTP (for testing):', forgotRes.data.otp);
    } catch (error) {
      console.log('❌ Forgot password test failed:', error.response?.data?.error || error.message);
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.log('❌ Initial connection failed:', error.message);
    console.log('Make sure the server is running on http://localhost:3001');
  }
}

testAPI();