import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Eye, Clock, User, Mail, Phone, MapPin } from 'lucide-react';

const PendingApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      const q = query(collection(db, 'members'), where('applicationStatus', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(apps.sort((a, b) => (b.applicationDate?.seconds || 0) - (a.applicationDate?.seconds || 0)));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId) => {
    if (!window.confirm('Approve this application?')) return;

    try {
      const memberRef = doc(db, 'members', appId);
      await updateDoc(memberRef, {
        applicationStatus: 'approved',
        active: true,
        memberSince: serverTimestamp(),
        approvedBy: user.email,
        approvedDate: serverTimestamp()
      });

      setApplications(applications.filter(app => app.id !== appId));
      setSelectedApp(null);
      toast.success('Application approved successfully!');
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (appId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    if (!window.confirm('Reject this application?')) return;

    try {
      const memberRef = doc(db, 'members', appId);
      await updateDoc(memberRef, {
        applicationStatus: 'rejected',
        rejectionReason: rejectionReason,
        approvedBy: user.email,
        approvedDate: serverTimestamp()
      });

      setApplications(applications.filter(app => app.id !== appId));
      setSelectedApp(null);
      setRejectionReason('');
      toast.success('Application rejected');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-devotional-maroon mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-devotional-maroon">Pending Applications</h1>
          <p className="text-gray-600 mt-2">Review and manage membership applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{applications.length}</p>
              </div>
              <Clock className="text-yellow-500" size={40} />
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="card p-12 text-center">
            <Clock className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Applications</h3>
            <p className="text-gray-500">All applications have been reviewed</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Applications List */}
            <div className="space-y-4">
              {applications.map(app => (
                <div
                  key={app.id}
                  className={`card p-6 cursor-pointer transition-all ${
                    selectedApp?.id === app.id
                      ? 'ring-4 ring-devotional-saffron shadow-xl'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-devotional-maroon mb-2">
                        {app.fullName}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          <span>{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          <span>{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{app.city}, {app.state}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>Applied on {formatDate(app.applicationDate)}</span>
                      </div>
                    </div>
                    <Eye className="text-devotional-saffron flex-shrink-0" size={20} />
                  </div>
                </div>
              ))}
            </div>

            {/* Application Details */}
            {selectedApp && (
              <div className="sticky top-8">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-devotional-maroon mb-6 border-b-2 border-devotional-gold pb-4">
                    Application Details
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <p className="text-lg">{selectedApp.fullName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <p className="text-sm">{selectedApp.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                        <p className="text-sm">{selectedApp.phone}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                      <p className="text-sm">{selectedApp.address}</p>
                      <p className="text-sm text-gray-600">{selectedApp.city}, {selectedApp.state} - {selectedApp.pincode}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Donation Type</label>
                        <p className="text-sm capitalize">{selectedApp.donationPreference}</p>
                      </div>
                      {selectedApp.donationPreference === 'monthly' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Amount</label>
                          <p className="text-sm font-bold text-devotional-saffron">₹{selectedApp.monthlyAmount}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Application Date</label>
                      <p className="text-sm">{formatDate(selectedApp.applicationDate)}</p>
                    </div>
                  </div>

                  {/* Rejection Reason Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rejection Reason (Optional)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="input-field"
                      rows="3"
                      placeholder="Provide a reason if rejecting..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp.id)}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApplications;
