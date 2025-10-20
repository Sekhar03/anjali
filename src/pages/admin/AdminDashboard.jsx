import { Link } from 'react-router-dom';
import { Users, CreditCard, TrendingUp, Calendar, Bell, Activity, UserCheck, Image } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    pendingApplications: 0,
    totalGalleryPhotos: 0
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch members
      const membersSnapshot = await getDocs(collection(db, 'members'));
      const members = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const activeMembers = members.filter(m => m.active).length;
      const pendingPayments = members.filter(m => m.paymentStatus === 'pending').length;
      const pendingApplications = members.filter(m => m.applicationStatus === 'pending').length;

      // Fetch payments
      const paymentsSnapshot = await getDocs(collection(db, 'payments'));
      const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      // Fetch gallery photos count
      const gallerySnapshot = await getDocs(collection(db, 'gallery'));
      const totalGalleryPhotos = gallerySnapshot.size;

      // Get recent members (last 5)
      const recentMembersData = members
        .filter(m => m.active)
        .sort((a, b) => (b.memberSince?.seconds || 0) - (a.memberSince?.seconds || 0))
        .slice(0, 5);

      // Get recent payments (last 5)
      const recentPaymentsData = payments
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5);

      setStats({
        totalMembers: members.length,
        activeMembers,
        totalRevenue,
        pendingPayments,
        pendingApplications,
        totalGalleryPhotos
      });
      setRecentMembers(recentMembersData);
      setRecentPayments(recentPaymentsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/members'
    },
    {
      title: 'Active Members',
      value: stats.activeMembers,
      icon: <Activity className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/admin/members'
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      icon: <UserCheck className="w-8 h-8" />,
      color: 'bg-yellow-500',
      link: '/admin/applications'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-devotional-saffron',
      link: '/admin/payments'
    },
    {
      title: 'Gallery Photos',
      value: stats.totalGalleryPhotos,
      icon: <Image className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/admin/gallery'
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments,
      icon: <Bell className="w-8 h-8" />,
      color: 'bg-red-500',
      link: '/admin/members'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="card p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Members */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Members</h2>
              <Link to="/admin/members" className="text-primary-600 hover:text-primary-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentMembers.length > 0 ? (
                recentMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-semibold text-gray-900">{member.fullName}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {member.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No members yet</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
              <Link to="/admin/payments" className="text-primary-600 hover:text-primary-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-semibold text-gray-900">{payment.name}</p>
                      <p className="text-sm text-gray-600">{payment.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{payment.amount}</p>
                      <span className={`text-xs font-semibold ${
                        payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No payments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/applications" className="card p-6 hover:shadow-xl transition-shadow text-center border-t-4 border-yellow-500">
            <UserCheck className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Applications</h3>
            <p className="text-gray-600">Approve or reject new members</p>
            {stats.pendingApplications > 0 && (
              <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                {stats.pendingApplications} Pending
              </span>
            )}
          </Link>
          
          <Link to="/admin/members" className="card p-6 hover:shadow-xl transition-shadow text-center border-t-4 border-blue-500">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Members</h3>
            <p className="text-gray-600">View and edit member information</p>
          </Link>
          
          <Link to="/admin/payments" className="card p-6 hover:shadow-xl transition-shadow text-center border-t-4 border-devotional-saffron">
            <CreditCard className="w-12 h-12 text-devotional-saffron mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Payments</h3>
            <p className="text-gray-600">Monitor donations and contributions</p>
          </Link>
          
          <Link to="/admin/gallery" className="card p-6 hover:shadow-xl transition-shadow text-center border-t-4 border-purple-500">
            <Image className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Gallery</h3>
            <p className="text-gray-600">Upload and organize celebration photos</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
