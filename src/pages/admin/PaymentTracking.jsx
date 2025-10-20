import { useState, useEffect } from 'react';
import { Search, Download, Filter, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const PaymentTracking = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, filterType, filterStatus, dateRange, payments]);

  const fetchPayments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'payments'));
      const paymentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(paymentsData);
      setFilteredPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(p => {
        if (!p.createdAt?.seconds) return false;
        const paymentDate = new Date(p.createdAt.seconds * 1000);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return paymentDate >= startDate && paymentDate <= endDate;
      });
    }

    setFilteredPayments(filtered);
  };

  const calculateStats = () => {
    const total = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const completed = filteredPayments.filter(p => p.status === 'completed').length;
    const pending = filteredPayments.filter(p => p.status === 'pending').length;
    const monthlyTotal = filteredPayments
      .filter(p => p.type === 'monthly')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return { total, completed, pending, monthlyTotal };
  };

  const stats = calculateStats();

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Amount', 'Type', 'Status', 'Date'];
    const rows = filteredPayments.map(p => [
      p.name,
      p.email,
      p.phone,
      p.amount,
      p.type,
      p.status,
      formatDate(p.createdAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${Date.now()}.csv`;
    a.click();
    toast.success('Payment data exported successfully');
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'N/A';
    return format(new Date(timestamp.seconds * 1000), 'dd MMM yyyy, hh:mm a');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Tracking</h1>
            <p className="text-gray-600 mt-2">Monitor all donations and contributions</p>
          </div>
          <button
            onClick={exportToCSV}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <DollarSign className="text-primary-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{stats.total.toLocaleString()}</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Completed</span>
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending</span>
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Total</span>
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-blue-600">₹{stats.monthlyTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Date Range */}
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="input-field text-sm"
                placeholder="Start"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="input-field text-sm"
                placeholder="End"
              />
            </div>
          </div>

          {(searchTerm || filterType !== 'all' || filterStatus !== 'all' || dateRange.start || dateRange.end) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredPayments.length} of {payments.length} payments
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setDateRange({ start: '', end: '' });
                }}
                className="text-primary-600 text-sm font-semibold hover:text-primary-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{payment.name}</div>
                      {payment.message && (
                        <div className="text-xs text-gray-500 italic">{payment.message}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.email}</div>
                      <div className="text-sm text-gray-500">{payment.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{payment.amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.type === 'monthly' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {payment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No payments found matching your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentTracking;
