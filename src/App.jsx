import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Payments from './pages/Payments';
import Register from './pages/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MemberDatabase from './pages/admin/MemberDatabase';
import PaymentTracking from './pages/admin/PaymentTracking';
import PendingApplications from './pages/admin/PendingApplications';
import GalleryManagement from './pages/admin/GalleryManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/members" element={
              <ProtectedRoute>
                <MemberDatabase />
              </ProtectedRoute>
            } />
            <Route path="/admin/payments" element={
              <ProtectedRoute>
                <PaymentTracking />
              </ProtectedRoute>
            } />
            <Route path="/admin/applications" element={
              <ProtectedRoute>
                <PendingApplications />
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoute>
                <GalleryManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
