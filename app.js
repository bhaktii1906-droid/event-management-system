const { useState, useEffect, createContext, useContext } = React;

// API Configuration
const API_BASE_URL = window.location.origin === 'http://localhost:3001' 
  ? 'http://localhost:3001/api' 
  : '/api';

// BackButton Component
const BackButton = ({ onClick, label = 'Back' }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200"
      style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
    >
      <i className="fas fa-arrow-left"></i>
      <span className="font-semibold">{label}</span>
    </button>
  );
};

// Context
const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';

  return (
    <div className={`toast ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}>
      <i className={`fas ${icon}`}></i>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`modal-content bg-white rounded-lg ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Loader Component
const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader"></div>
    </div>
  );
};

// Demo Data for fallback
const DEMO_EVENTS = [
  { id: 'event_001', title: 'Tech Conference 2025', description: 'Annual technology conference featuring keynotes from industry leaders, workshops, and networking sessions.', date: '2025-12-15', time: '09:00', end_time: '18:00', type: 'Conference', location: 'New Delhi Convention Center', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop', capacity: 500, booked_seats: 320, amenities: 'WiFi, Catering, Parking, Certificate', status: 'upcoming' },
  { id: 'event_002', title: 'Advanced React Workshop', description: 'Hands-on workshop on Advanced React patterns, hooks, and state management with real-world projects.', date: '2025-12-20', time: '10:00', end_time: '17:00', type: 'Workshop', location: 'Bangalore Tech Hub', image: 'https://images.unsplash.com/photo-1516534775068-bb57b194b406?w=800&h=500&fit=crop', capacity: 80, booked_seats: 65, amenities: 'WiFi, Lunch, Materials, Certificate', status: 'upcoming' },
  { id: 'event_003', title: 'Music Festival 2025', description: 'Three-day music festival featuring international and local artists across multiple genres.', date: '2025-12-22', time: '16:00', end_time: '23:00', type: 'Concert', location: 'Mumbai Marine Drive', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop', capacity: 2000, booked_seats: 1850, amenities: 'Parking, Catering, VIP Lounge, Security', status: 'upcoming' }
];

// HomePage Component (Same as before)
const HomePage = () => {
  const { setCurrentPage, events } = useApp();
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="fade-in">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-calendar-check text-3xl text-blue-600"></i>
            <h1 className="text-2xl font-bold gradient-text">EventEaseWeb</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
            <a href="#events" className="text-gray-700 hover:text-blue-600 transition">Events</a>
            <button onClick={() => setCurrentPage('login')} className="text-gray-700 hover:text-blue-600 transition">Login</button>
            <button onClick={() => setCurrentPage('register')} className="btn-primary text-white px-6 py-2 rounded-lg">Sign Up</button>
          </nav>
          <button className="md:hidden text-2xl text-gray-700">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      <section id="home" className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Manage Events with Ease</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Your all-in-one platform for discovering, booking, and managing events</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => setCurrentPage('register')} className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover-scale">Get Started</button>
            <button onClick={() => setCurrentPage('events')} className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition">Browse Events</button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Choose EventEaseWeb?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg card-hover text-center">
              <div className="text-5xl mb-4 text-blue-600"><i className="fas fa-search"></i></div>
              <h3 className="text-2xl font-bold mb-3">Easy Discovery</h3>
              <p className="text-gray-600">Find events that match your interests with our powerful search and filter options</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg card-hover text-center">
              <div className="text-5xl mb-4 text-blue-600"><i className="fas fa-ticket-alt"></i></div>
              <h3 className="text-2xl font-bold mb-3">Quick Booking</h3>
              <p className="text-gray-600">Book your seats in seconds with our streamlined booking process</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg card-hover text-center">
              <div className="text-5xl mb-4 text-blue-600"><i className="fas fa-bell"></i></div>
              <h3 className="text-2xl font-bold mb-3">Instant Notifications</h3>
              <p className="text-gray-600">Get real-time updates about your bookings and upcoming events</p>
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden card-hover event-card">
                <img src={event.image} alt={event.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-2">{event.type}</span>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span><i className="fas fa-calendar mr-1"></i>{event.date}</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>{event.location.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => setCurrentPage('login')} className="btn-primary text-white px-6 py-2 rounded-lg">Register Free</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setCurrentPage('events')} className="btn-primary text-white px-8 py-3 rounded-lg text-lg">View All Events</button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EventEaseWeb</h3>
              <p className="text-gray-400">Your trusted platform for event management and booking.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <div className="flex gap-4 text-2xl">
                <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook"></i></a>
                <a href="#" className="hover:text-blue-400"><i className="fab fa-twitter"></i></a>
                <a href="#" className="hover:text-blue-400"><i className="fab fa-instagram"></i></a>
                <a href="#" className="hover:text-blue-400"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EventEaseWeb. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// RegisterPage Component (Same as before)
const RegisterPage = () => {
  const { setCurrentPage, showToast } = useApp();
  
  const handleBack = () => {
    setCurrentPage('home');
  };
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.mobile) newErrors.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });
      
      showToast(response.data.message, 'success');
      setCurrentPage('login');
    } catch (error) {
      showToast(error.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 fade-in">
      <BackButton onClick={handleBack} />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <i className="fas fa-user-plus text-5xl text-blue-600 mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join EventEaseWeb today</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
              <input
                type="text"
                className={`w-full px-4 py-3 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                placeholder="10-digit mobile number"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Already have an account? <button onClick={() => setCurrentPage('login')} className="text-blue-600 font-semibold hover:underline">Login</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// LoginPage Component (Same as before)
const LoginPage = () => {
  const { setCurrentPage, login, showToast } = useApp();
  
  const handleBack = () => {
    setCurrentPage('home');
  };
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    const success = await login(formData.email, formData.password);
    setLoading(false);
    
    if (!success) {
      showToast('Invalid email or password', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 fade-in">
      <BackButton onClick={handleBack} />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <i className="fas fa-sign-in-alt text-5xl text-blue-600 mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" onClick={() => setCurrentPage('forgot-password')} className="text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Don't have an account? <button onClick={() => setCurrentPage('register')} className="text-blue-600 font-semibold hover:underline">Sign Up</button></p>
          </div>
          <div className="mt-4 text-center">
            <button onClick={() => setCurrentPage('admin-login')} className="text-purple-600 font-semibold hover:underline">
              <i className="fas fa-user-shield mr-2"></i>Admin Login
            </button>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-sm text-blue-700">Email: user@example.com</p>
          <p className="text-sm text-blue-700">Password: User@123</p>
        </div>
      </div>
    </div>
  );
};

// AdminLoginPage Component (Same as before)
const AdminLoginPage = () => {
  const { setCurrentPage, adminLogin, showToast } = useApp();
  
  const handleBack = () => {
    setCurrentPage('home');
  };
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await adminLogin(formData.email, formData.password);
    setLoading(false);
    
    if (!success) {
      showToast('Invalid admin credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center px-4 py-12 fade-in">
      <BackButton onClick={handleBack} />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <i className="fas fa-user-shield text-6xl text-white mb-4"></i>
          <h2 className="text-4xl font-bold text-white">Admin Portal</h2>
          <p className="text-white opacity-90 mt-2">Secure admin access</p>
        </div>
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Admin Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter admin email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter password"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50">
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setCurrentPage('login')} className="text-gray-600 hover:text-gray-800">
              <i className="fas fa-user mr-2"></i>User Login
            </button>
          </div>
        </div>
        <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg p-4">
          <p className="text-sm text-white font-semibold mb-2">Demo Admin Credentials:</p>
          <p className="text-sm text-white">Email: admin@example.com</p>
          <p className="text-sm text-white">Password: Admin@123</p>
        </div>
      </div>
    </div>
  );
};

// ForgotPasswordPage Component (Same as before)
const ForgotPasswordPage = () => {
  const { setCurrentPage, showToast } = useApp();
  
  const handleBack = () => {
    setCurrentPage('login');
  };
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      setLoading(false);
      setStep(2);
      showToast(`OTP sent to ${email}`, 'success');
      console.log('OTP for testing:', response.data.otp);
    } catch (error) {
      setLoading(false);
      showToast(error.response?.data?.error || 'Failed to send OTP', 'error');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP', 'error');
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        otp,
        newPassword
      });
      setLoading(false);
      showToast('Password reset successful!', 'success');
      setCurrentPage('login');
    } catch (error) {
      setLoading(false);
      showToast(error.response?.data?.error || 'Failed to reset password', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 fade-in">
      <BackButton onClick={handleBack} label="Back to Login" />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <i className="fas fa-key text-5xl text-blue-600 mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">Step {step} of 3</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Enter OTP</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
                <p className="text-sm text-gray-500 mt-2">OTP sent to {email}</p>
              </div>
              <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg font-semibold">
                Verify OTP
              </button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// UserDashboard Component (Updated with upcoming events and working booking actions)
const UserDashboard = () => {
  const { currentUser, setCurrentPage, logout, showToast } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', mobile: '' });
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
      fetchUpcomingEvents();
    }
  }, [currentUser, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (activeTab === 'dashboard' || activeTab === 'bookings') {
        const bookingsRes = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);
      }
      
      if (activeTab === 'dashboard' || activeTab === 'enquiries') {
        const enquiriesRes = await axios.get(`${API_BASE_URL}/enquiries/my-enquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnquiries(enquiriesRes.data);
      }
      
      if (activeTab === 'dashboard' || activeTab === 'notifications') {
        const notificationsRes = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(notificationsRes.data);
      }
      
      if (activeTab === 'profile') {
        const profileRes = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileRes.data);
        setProfileForm({
          name: profileRes.data.name,
          mobile: profileRes.data.mobile
        });
      }
      
    } catch (error) {
      console.error('Fetch data error:', error);
      showToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/events/upcoming`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpcomingEvents(response.data.events || []);
    } catch (error) {
      // Use demo events if API fails
      const today = new Date().toISOString().split('T')[0];
      const filteredEvents = DEMO_EVENTS.filter(event => event.date >= today).slice(0, 6);
      setUpcomingEvents(filteredEvents);
    }
  };

  const handleViewBooking = async (bookingId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedBooking(response.data);
      setShowBookingModal(true);
    } catch (error) {
      showToast('Failed to fetch booking details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/bookings/${selectedBooking.id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowCancelModal(false);
      setSelectedBooking(null);
      showToast('Booking cancelled successfully', 'success');
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to cancel booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showToast('Notification marked as read', 'success');
    } catch (error) {
      showToast('Failed to mark notification', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showToast('All notifications marked as read', 'success');
    } catch (error) {
      showToast('Failed to mark notifications', 'error');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/profile`, profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowProfileModal(false);
      fetchData();
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/change-password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowChangePasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to change password', 'error');
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read).length;


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="text-xl font-bold gradient-text">EventEaseWeb</h1>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentPage('events')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              <i className="fas fa-calendar mr-2"></i>Browse Events
            </button>
            <div className="relative">
              <button 
                onClick={() => setActiveTab('notifications')}
                className="relative text-gray-700 hover:text-blue-600"
              >
                <i className="fas fa-bell text-xl"></i>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Welcome, {currentUser.name}</span>
              <button onClick={logout} className="text-red-600 hover:text-red-700">
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''} fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg md:shadow-none`}>
          <nav className="p-4 space-y-2 mt-16 md:mt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-home"></i>Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-ticket-alt"></i>My Bookings
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'enquiries' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-question-circle"></i>My Enquiries
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-bell"></i>Notifications
              {unreadNotifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-user"></i>Profile
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="fade-in">
              {activeTab === 'dashboard' && (
                <>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white opacity-90 mb-1">My Bookings</p>
                          <p className="text-4xl font-bold">{bookings.length}</p>
                        </div>
                        <i className="fas fa-ticket-alt text-5xl opacity-20"></i>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white opacity-90 mb-1">My Enquiries</p>
                          <p className="text-4xl font-bold">{enquiries.length}</p>
                        </div>
                        <i className="fas fa-question-circle text-5xl opacity-20"></i>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white opacity-90 mb-1">Notifications</p>
                          <p className="text-4xl font-bold">{unreadNotifications} unread</p>
                        </div>
                        <i className="fas fa-bell text-5xl opacity-20"></i>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events Section */}
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Upcoming Events</h3>
                      <button onClick={() => setCurrentPage('events')} className="text-blue-600 hover:underline">View All</button>
                    </div>
                    {upcomingEvents.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No upcoming events</p>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.slice(0, 3).map(event => (
                          <div key={event.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                            <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                              <h4 className="font-bold text-gray-800 mb-2">{event.title}</h4>
                              <p className="text-sm text-gray-600 mb-2"><i className="fas fa-calendar mr-2"></i>{event.date} at {event.time}</p>
                              <p className="text-sm text-gray-600 mb-3"><i className="fas fa-map-marker-alt mr-2"></i>{event.location.split(' ').slice(0, 2).join(' ')}</p>
                              <button 
                                onClick={() => setCurrentPage('event-detail', event.id)}
                                className="w-full btn-primary text-white py-2 rounded-lg text-sm"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
                        <button onClick={() => setActiveTab('bookings')} className="text-blue-600 hover:underline">View All</button>
                      </div>
                      {bookings.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No bookings yet</p>
                      ) : (
                        <div className="space-y-4">
                          {bookings.slice(0, 5).map(booking => (
                            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-bold text-gray-800">{booking.event_title}</h4>
                                <p className="text-sm text-gray-600">Date: {booking.booking_date}</p>
                                <p className="text-sm text-gray-600">Seats: {booking.number_of_seats}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Recent Enquiries</h3>
                        <button onClick={() => setActiveTab('enquiries')} className="text-blue-600 hover:underline">View All</button>
                      </div>
                      {enquiries.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No enquiries yet</p>
                      ) : (
                        <div className="space-y-4">
                          {enquiries.slice(0, 5).map(enquiry => (
                            <div key={enquiry.id} className="p-4 border rounded-lg">
                              <h4 className="font-bold text-gray-800 mb-2">{enquiry.event_title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{enquiry.message.substring(0, 100)}...</p>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                enquiry.status === 'replied' ? 'bg-green-100 text-green-600' :
                                enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {enquiry.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h2>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                      <i className="fas fa-ticket-alt text-6xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 text-lg mb-4">No bookings yet</p>
                      <button onClick={() => setCurrentPage('events')} className="btn-primary text-white px-6 py-3 rounded-lg">
                        Browse Events
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(booking => (
                              <tr key={booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{booking.event_title}</div>
                                      <div className="text-sm text-gray-500">{booking.event_location}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{booking.event_date}</div>
                                  <div className="text-sm text-gray-500">{booking.event_time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {booking.number_of_seats} seats
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button 
                                    onClick={() => handleViewBooking(booking.id)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                  >
                                    <i className="fas fa-eye mr-1"></i>View
                                  </button>
                                  {booking.status === 'confirmed' && (
                                    <button 
                                      onClick={() => handleCancelBooking(booking)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <i className="fas fa-times mr-1"></i>Cancel
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'enquiries' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">My Enquiries</h2>
                  {enquiries.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                      <i className="fas fa-question-circle text-6xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 text-lg mb-4">No enquiries yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {enquiries.map(enquiry => (
                        <div key={enquiry.id} className="bg-white rounded-lg shadow-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{enquiry.event_title}</h3>
                              <p className="text-gray-600">{enquiry.message}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              enquiry.status === 'replied' ? 'bg-green-100 text-green-600' :
                              enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {enquiry.status}
                            </span>
                          </div>
                          {enquiry.admin_reply && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-bold text-gray-800 mb-2">Admin Reply:</h4>
                              <p className="text-gray-700">{enquiry.admin_reply}</p>
                            </div>
                          )}
                          <div className="mt-4 text-sm text-gray-500">
                            Submitted on {enquiry.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
                    {unreadNotifications > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Mark All as Read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                      <i className="fas fa-bell-slash text-6xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 text-lg">No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`bg-white rounded-lg shadow-lg p-6 ${!notification.is_read ? 'border-l-4 border-blue-500' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-2">{notification.title}</h3>
                              <p className="text-gray-600 mb-2">{notification.message}</p>
                              <p className="text-sm text-gray-500">
                                <i className="fas fa-clock mr-2"></i>
                                {new Date(notification.created_at).toLocaleString()}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-200"
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && profile && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h2>
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.name}</p>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.email}</p>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.mobile}</p>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Registration Date</label>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.registration_date}</p>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Account Status</label>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              profile.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {profile.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Actions</h3>
                        <div className="space-y-4">
                          <button
                            onClick={() => setShowProfileModal(true)}
                            className="w-full btn-primary text-white py-3 rounded-lg font-semibold"
                          >
                            <i className="fas fa-edit mr-2"></i>Edit Profile
                          </button>
                          <button
                            onClick={() => setShowChangePasswordModal(true)}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
                          >
                            <i className="fas fa-key mr-2"></i>Change Password
                          </button>
                          <button
                            onClick={logout}
                            className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100"
                          >
                            <i className="fas fa-sign-out-alt mr-2"></i>Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Edit Profile">
        <form onSubmit={handleUpdateProfile}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={profileForm.name}
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={profileForm.mobile}
                onChange={(e) => setProfileForm({...profileForm, mobile: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg font-semibold">
              Update Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} title="Change Password">
        <form onSubmit={handleChangePassword}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg font-semibold">
              Change Password
            </button>
          </div>
        </form>
      </Modal>

      {/* View Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Booking Details" size="lg">
        {selectedBooking && (
          <div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Event Details</h4>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Event:</span> {selectedBooking.event_title}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Date:</span> {selectedBooking.event_date}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Time:</span> {selectedBooking.event_time}</p>
                <p className="text-gray-700"><span className="font-semibold">Location:</span> {selectedBooking.event_location}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Booking Details</h4>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Booking ID:</span> {selectedBooking.id}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Booking Date:</span> {selectedBooking.booking_date}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Number of Seats:</span> {selectedBooking.number_of_seats}</p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                    selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </p>
              </div>
            </div>
            {selectedBooking.attendee_details && (
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-2">Attendee Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {JSON.parse(selectedBooking.attendee_details).map((attendee, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-gray-700"><span className="font-semibold">Attendee {index + 1}:</span> {attendee.name} ({attendee.email})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Booking">
        {selectedBooking && (
          <div>
            <p className="text-gray-700 mb-6">Are you sure you want to cancel your booking for <span className="font-bold">{selectedBooking.event_title}</span>?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                No, Keep Booking
              </button>
              <button
                onClick={confirmCancelBooking}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// EventListingPage Component (Updated)
const EventListingPage = () => {
  const { events, setCurrentPage, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 6;

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPageNum - 1) * itemsPerPage;
  const displayedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-calendar-check text-2xl text-blue-600"></i>
            <h1 className="text-xl font-bold gradient-text">EventEaseWeb</h1>
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <button onClick={() => setCurrentPage(currentUser.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')} className="text-gray-700 hover:text-blue-600">
                  <i className="fas fa-home mr-2"></i>Dashboard
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentPage('login')} className="text-gray-700 hover:text-blue-600">Login</button>
                <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-blue-600">Home</button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Browse Events</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Search Events</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by event name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Filter by Type</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Cultural">Cultural</option> 
                  <option value="Conference">Conference</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Concert">Concert</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {displayedEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden card-hover event-card">
                <img src={event.image} alt={event.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-2">{event.type}</span>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><i className="fas fa-calendar mr-2 text-blue-600"></i>{event.date} at {event.time}</p>
                    <p><i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>{event.location}</p>
                    <p><i className="fas fa-users mr-2 text-blue-600"></i>{event.capacity - event.booked_seats} seats available</p>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => setCurrentPage('event-detail', event.id)} className="btn-primary text-white px-6 py-2 rounded-lg">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPageNum(page)}
                  className={`px-4 py-2 rounded-lg ${page === currentPageNum ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// EventDetailPage Component (Updated)
const EventDetailPage = () => {
  const { selectedEventId, setCurrentPage, currentUser, showToast } = useApp();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/events/${selectedEventId}`);
        setEvent(response.data);
      } catch (error) {
        showToast('Failed to load event details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedEventId) {
      fetchEvent();
    }
  }, [selectedEventId]);

  const handleBookNow = () => {
    if (!currentUser) {
      showToast('Please login to book events', 'error');
      setCurrentPage('login');
      return;
    }
    setCurrentPage('booking', event.id);
  };

  const handleSendEnquiry = async () => {
    if (!enquiryMessage) {
      showToast('Please enter your message', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/enquiries`, {
        eventId: event.id,
        message: enquiryMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowEnquiryModal(false);
      setEnquiryMessage('');
      showToast('Enquiry sent successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to submit enquiry', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800">Event not found</h2>
          <button onClick={() => setCurrentPage('events')} className="btn-primary text-white px-6 py-3 rounded-lg mt-4">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setCurrentPage('events')} className="text-gray-700 hover:text-blue-600">
            <i className="fas fa-arrow-left mr-2"></i>Back to Events
          </button>
          <h1 className="text-xl font-bold gradient-text">EventEaseWeb</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 fade-in">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-[500px] object-cover" />
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">{event.type}</span>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                <i className="fas fa-check-circle mr-2"></i>Free Event
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-calendar text-blue-600 text-xl"></i>
                  <div>
                    <p className="font-semibold text-gray-800">Date</p>
                    <p className="text-gray-600">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-clock text-blue-600 text-xl"></i>
                  <div>
                    <p className="font-semibold text-gray-800">Time</p>
                    <p className="text-gray-600">{event.time} - {event.end_time}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-map-marker-alt text-blue-600 text-xl"></i>
                  <div>
                    <p className="font-semibold text-gray-800">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-users text-blue-600 text-xl"></i>
                  <div>
                    <p className="font-semibold text-gray-800">Available Seats</p>
                    <p className="text-gray-600">{event.capacity - event.booked_seats} of {event.capacity}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h3>
              <div className="flex flex-wrap gap-3">
                {event.amenities.split(',').map((amenity, idx) => (
                  <span key={idx} className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                    <i className="fas fa-check mr-2"></i>{amenity.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleBookNow} className="flex-1 btn-primary text-white py-4 rounded-lg text-lg font-semibold">
                <i className="fas fa-ticket-alt mr-2"></i>Register Event
              </button>
              <button onClick={() => setShowEnquiryModal(true)} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
                <i className="fas fa-question-circle mr-2"></i>Ask Question
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showEnquiryModal} onClose={() => setShowEnquiryModal(false)} title="Send Enquiry">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Your Message</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Type your question or message..."
            value={enquiryMessage}
            onChange={(e) => setEnquiryMessage(e.target.value)}
          ></textarea>
          <button onClick={handleSendEnquiry} className="w-full btn-primary text-white py-3 rounded-lg mt-4">
            Send Enquiry
          </button>
        </div>
      </Modal>
    </div>
  );
};

// BookingPage Component (Updated)
const BookingPage = () => {
  const { selectedEventId, events, currentUser, setCurrentPage, showToast } = useApp();
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [attendees, setAttendees] = useState([{ name: '', email: '' }]);
  const [loading, setLoading] = useState(false);
  const event = events.find(e => e.id === selectedEventId);

  if (!event) return <div>Event not found</div>;

  const handleSeatsChange = (num) => {
    setNumberOfSeats(num);
    const newAttendees = Array.from({ length: num }, (_, i) => attendees[i] || { name: '', email: '' });
    setAttendees(newAttendees);
  };

  const handleAttendeeChange = (index, field, value) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const handleConfirmBooking = async () => {
    const invalidAttendee = attendees.some(a => !a.name || !a.email);
    if (invalidAttendee) {
      showToast('Please fill all attendee details', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/bookings`, {
        eventId: event.id,
        numberOfSeats,
        attendeeDetails: attendees
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast('Registration confirmed successfully!', 'success');
      setCurrentPage('user-dashboard');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setCurrentPage('event-detail', event.id)} className="text-gray-700 hover:text-blue-600">
            <i className="fas fa-arrow-left mr-2"></i>Back
          </button>
          <h1 className="text-xl font-bold gradient-text">Booking Confirmation</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h3>
                <div className="flex gap-4 mb-6">
                  <img src={event.image} alt={event.title} className="w-32 h-32 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h4>
                    <p className="text-gray-600 mb-1"><i className="fas fa-calendar mr-2"></i>{event.date} at {event.time}</p>
                    <p className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i>{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Select Seats</h3>
                <div className="flex gap-4 mb-6">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => handleSeatsChange(num)}
                      className={`px-6 py-3 rounded-lg font-semibold ${numberOfSeats === num ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Attendee Details</h3>
                <div className="space-y-4">
                  {attendees.map((attendee, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-3">Attendee {idx + 1}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={attendee.name}
                            onChange={(e) => handleAttendeeChange(idx, 'name', e.target.value)}
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={attendee.email}
                            onChange={(e) => handleAttendeeChange(idx, 'email', e.target.value)}
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Registration Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of seats</span>
                    <span className="font-semibold">{numberOfSeats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available seats</span>
                    <span className="font-semibold">{event.capacity - event.booked_seats}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-center font-semibold">
                      <i className="fas fa-check-circle mr-2"></i>Free Registration
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="w-full btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { currentUser, logout, setCurrentPage, showToast } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    end_time: '',
    type: 'Conference',
    location: '',
    image: '',
    capacity: 100,
    amenities: '',
    status: 'upcoming'
  });

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchData();
    }
  }, [currentUser, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (activeTab === 'dashboard') {
        const statsRes = await axios.get(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);
      }
      
      if (activeTab === 'events') {
        const eventsRes = await axios.get(`${API_BASE_URL}/events`);
        setEvents(eventsRes.data.events);
      }
      
      if (activeTab === 'users') {
        const usersRes = await axios.get(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data);
      }
      
      if (activeTab === 'bookings') {
        const bookingsRes = await axios.get(`${API_BASE_URL}/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);
      }
      
      if (activeTab === 'enquiries') {
        const enquiriesRes = await axios.get(`${API_BASE_URL}/admin/enquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnquiries(enquiriesRes.data);
      }
      
    } catch (error) {
      showToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/admin/events`, eventForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEventModal(false);
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        end_time: '',
        type: 'Conference',
        location: '',
        image: '',
        capacity: 100,
        amenities: '',
        status: 'upcoming'
      });
      fetchData();
      setActiveTab('events');
      showToast('Event created successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create event', 'error');
    }
  };

  const handleEditEvent = async (event) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/admin/events/${event.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedEvent(response.data);
      setEventForm({
        title: response.data.title,
        description: response.data.description,
        date: response.data.date,
        time: response.data.time,
        end_time: response.data.end_time,
        type: response.data.type,
        location: response.data.location,
        image: response.data.image,
        capacity: response.data.capacity,
        amenities: response.data.amenities,
        status: response.data.status
      });
      setShowEditEventModal(true);
    } catch (error) {
      showToast('Failed to fetch event details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/admin/events/${selectedEvent.id}`, eventForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditEventModal(false);
      setSelectedEvent(null);
      fetchData();
      showToast('Event updated successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update event', 'error');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE_URL}/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showToast('Event deleted successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete event', 'error');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/admin/bookings/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showToast('Booking status updated', 'success');
    } catch (error) {
      showToast('Failed to update booking', 'error');
    }
  };

  const handleViewBooking = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedBooking(response.data);
      setShowBookingModal(true);
    } catch (error) {
      showToast('Failed to fetch booking details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/admin/users/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showToast('User status updated', 'success');
    } catch (error) {
      showToast('Failed to update user', 'error');
    }
  };

  const handleReplyToEnquiry = async () => {
    if (!replyMessage) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/admin/enquiries/${selectedEnquiry.id}/reply`, 
        { reply: replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowReplyModal(false);
      setReplyMessage('');
      setSelectedEnquiry(null);
      fetchData();
      showToast('Reply sent successfully', 'success');
    } catch (error) {
      showToast('Failed to send reply', 'error');
    }
  };

  
  if (loading && !showBookingModal && !showEditEventModal) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl">
              <i className="fas fa-bars"></i>
            </button>
            <i className="fas fa-user-shield text-2xl"></i>
            <h1 className="text-xl font-bold">Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <span>Welcome, {currentUser.name}</span>
            <button onClick={logout} className="hover:text-gray-200">
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''} fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg md:shadow-none`}>
          <nav className="p-4 space-y-2 mt-16 md:mt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-home"></i>Dashboard
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'events' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-calendar"></i>Events
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'users' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-users"></i>Users
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-ticket-alt"></i>Bookings
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'enquiries' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <i className="fas fa-question-circle"></i>Enquiries
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          {activeTab === 'dashboard' && stats && (
            <div className="fade-in">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="stat-card bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white opacity-90 mb-1">Total Events</p>
                      <p className="text-4xl font-bold">{stats.totalEvents}</p>
                    </div>
                    <i className="fas fa-calendar text-5xl opacity-20"></i>
                  </div>
                </div>
                <div className="stat-card bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white opacity-90 mb-1">Total Users</p>
                      <p className="text-4xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <i className="fas fa-users text-5xl opacity-20"></i>
                  </div>
                </div>
                <div className="stat-card bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white opacity-90 mb-1">Total Bookings</p>
                      <p className="text-4xl font-bold">{stats.totalBookings}</p>
                    </div>
                    <i className="fas fa-ticket-alt text-5xl opacity-20"></i>
                  </div>
                </div>
                <div className="stat-card bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white opacity-90 mb-1">Pending Enquiries</p>
                      <p className="text-4xl font-bold">{stats.pendingEnquiries}</p>
                    </div>
                    <i className="fas fa-envelope text-5xl opacity-20"></i>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Bookings</h3>
                  {stats.recentBookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent bookings</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentBookings.map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-bold text-gray-800">{booking.event_title}</h4>
                            <p className="text-sm text-gray-600">User: {booking.user_name}</p>
                            <p className="text-sm text-gray-600">Seats: {booking.number_of_seats}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Enquiries</h3>
                  {stats.recentEnquiries.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent enquiries</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentEnquiries.map(enquiry => (
                        <div key={enquiry.id} className="p-4 border rounded-lg">
                          <h4 className="font-bold text-gray-800 mb-2">{enquiry.event_title}</h4>
                          <p className="text-sm text-gray-600 mb-2">From: {enquiry.user_name}</p>
                          <p className="text-sm text-gray-600">{enquiry.message.substring(0, 100)}...</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            enquiry.status === 'replied' ? 'bg-green-100 text-green-600' :
                            enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {enquiry.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Events Management</h2>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="btn-primary text-white px-6 py-3 rounded-lg font-semibold"
                >
                  <i className="fas fa-plus mr-2"></i>Create Event
                </button>
              </div>
              
              {events.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                  <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg mb-4">No events found</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {events.map(event => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12">
                                  <img className="h-12 w-12 rounded-lg object-cover" src={event.image} alt={event.title} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                  <div className="text-sm text-gray-500">{event.type}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{event.date}</div>
                              <div className="text-sm text-gray-500">{event.time} - {event.end_time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{event.booked_seats} / {event.capacity}</div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${(event.booked_seats / event.capacity) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                                event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleEditEvent(event)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Users Management</h2>
              
              {users.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                  <i className="fas fa-users-slash text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">No users found</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.mobile}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.registration_date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <select
                                value={user.status}
                                onChange={(e) => handleUpdateUserStatus(user.id, e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Bookings Management</h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                  <i className="fas fa-ticket-alt text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">No bookings found</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map(booking => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{booking.event_title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{booking.user_name}</div>
                              <div className="text-sm text-gray-500">{booking.user_email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.booking_date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {booking.number_of_seats} seats
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={booking.status}
                                onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1"
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleViewBooking(booking.id)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Enquiries Management</h2>
              
              {enquiries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                  <i className="fas fa-question-circle text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">No enquiries found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {enquiries.map(enquiry => (
                    <div key={enquiry.id} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{enquiry.event_title}</h3>
                          <p className="text-gray-600 mb-2">From: {enquiry.user_name} ({enquiry.user_email})</p>
                          <p className="text-gray-700">{enquiry.message}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          enquiry.status === 'replied' ? 'bg-green-100 text-green-600' :
                          enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {enquiry.status}
                        </span>
                      </div>
                      {enquiry.admin_reply ? (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-bold text-gray-800 mb-2">Admin Reply:</h4>
                          <p className="text-gray-700">{enquiry.admin_reply}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setShowReplyModal(true);
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Reply to Enquiry
                        </button>
                      )}
                      <div className="mt-4 text-sm text-gray-500">
                        Submitted on {enquiry.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create Event Modal */}
      <Modal isOpen={showEventModal} onClose={() => setShowEventModal(false)} title="Create New Event" size="lg">
        <form onSubmit={handleCreateEvent}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Event Type</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.type}
                onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Concert">Concert</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Seminar">Seminar</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.date}
                onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Start Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.time}
                onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.end_time}
                onChange={(e) => setEventForm({...eventForm, end_time: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.capacity}
                onChange={(e) => setEventForm({...eventForm, capacity: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.status}
                onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.image}
                onChange={(e) => setEventForm({...eventForm, image: e.target.value})}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Amenities</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={eventForm.amenities}
                onChange={(e) => setEventForm({...eventForm, amenities: e.target.value})}
                placeholder="WiFi, Catering, Parking, Certificate"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                required
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg font-semibold">
                Create Event
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal isOpen={showEditEventModal} onClose={() => setShowEditEventModal(false)} title="Edit Event" size="lg">
        {selectedEvent && (
          <form onSubmit={handleUpdateEvent}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Event Type</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.type}
                  onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
                >
                  <option value="Conference">Conference</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Concert">Concert</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option> 
                  <option value="Seminar">Seminar</option>
                  <option value="Webinar">Webinar</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.end_time}
                  onChange={(e) => setEventForm({...eventForm, end_time: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({...eventForm, capacity: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Status</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.status}
                  onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.image}
                  onChange={(e) => setEventForm({...eventForm, image: e.target.value})}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Amenities</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={eventForm.amenities}
                  onChange={(e) => setEventForm({...eventForm, amenities: e.target.value})}
                  placeholder="WiFi, Catering, Parking, Certificate"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg font-semibold">
                  Update Event
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* View Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Booking Details" size="lg">
        {selectedBooking && (
          <div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Event Details</h4>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Event:</span> {selectedBooking.event_title}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Date:</span> {selectedBooking.event_date}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Time:</span> {selectedBooking.event_time} - {selectedBooking.event_end_time}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Location:</span> {selectedBooking.event_location}</p>
                <p className="text-gray-700"><span className="font-semibold">Capacity:</span> {selectedBooking.event_booked_seats}/{selectedBooking.event_capacity}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">User Details</h4>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Name:</span> {selectedBooking.user_name}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {selectedBooking.user_email}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Mobile:</span> {selectedBooking.user_mobile}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Booking Details</h4>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Booking ID:</span> {selectedBooking.id}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Booking Date:</span> {selectedBooking.booking_date}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Number of Seats:</span> {selectedBooking.number_of_seats}</p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                    selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </p>
              </div>
            </div>
            {selectedBooking.attendee_details && (
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-2">Attendee Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {JSON.parse(selectedBooking.attendee_details).map((attendee, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-gray-700"><span className="font-semibold">Attendee {index + 1}:</span> {attendee.name} ({attendee.email})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <select
                value={selectedBooking.status}
                onChange={(e) => handleUpdateBookingStatus(selectedBooking.id, e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply to Enquiry Modal */}
      <Modal isOpen={showReplyModal} onClose={() => setShowReplyModal(false)} title="Reply to Enquiry">
        {selectedEnquiry && (
          <div>
            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-2">From: {selectedEnquiry.user_name}</h4>
              <p className="text-gray-600 mb-4">{selectedEnquiry.message}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Reply</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="5"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
              ></textarea>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleReplyToEnquiry}
                className="flex-1 btn-primary text-white py-3 rounded-lg font-semibold"
              >
                Send Reply
              </button>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Main App Component (Updated)
const App = () => {
  const [currentPage, setCurrentPageState] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [toast, setToast] = useState(null);
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const setCurrentPage = (page, eventId = null) => {
    setCurrentPageState(page);
    if (eventId) setSelectedEventId(eventId);
    window.scrollTo(0, 0);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      setEvents(response.data.events || DEMO_EVENTS);
    } catch (error) {
      console.log('Using demo events data');
      setEvents(DEMO_EVENTS);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      
      const { token, user } = response.data;
      
      setCurrentUser(user);
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      showToast(`Welcome back, ${user.name}!`, 'success');
      setCurrentPage('user-dashboard');
      
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      showToast(error.response?.data?.error || 'Login failed', 'error');
      return false;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
      
      const { token, user } = response.data;
      
      setCurrentUser(user);
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      showToast('Admin login successful', 'success');
      setCurrentPage('admin-dashboard');
      
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      showToast(error.response?.data?.error || 'Admin login failed', 'error');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setCurrentPage('home');
    showToast('Logged out successfully', 'success');
  };

  const contextValue = {
    currentPage,
    setCurrentPage,
    currentUser,
    selectedEventId,
    events,
    loading,
    login,
    adminLogin,
    logout,
    showToast
  };

  return (
    <AppContext.Provider value={contextValue}>
      {loading && <Loader />}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'register' && <RegisterPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'forgot-password' && <ForgotPasswordPage />}
      {currentPage === 'admin-login' && <AdminLoginPage />}
      {currentPage === 'user-dashboard' && <UserDashboard />}
      {currentPage === 'admin-dashboard' && <AdminDashboard />}
      {currentPage === 'events' && <EventListingPage />}
      {currentPage === 'event-detail' && <EventDetailPage />}
      {currentPage === 'booking' && <BookingPage />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AppContext.Provider>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);