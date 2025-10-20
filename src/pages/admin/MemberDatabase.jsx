import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, X, Save, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

const MemberDatabase = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, filterStatus, members]);

  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const membersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter(m => m.active);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter(m => !m.active);
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(m => m.paymentStatus === 'pending');
      } else if (filterStatus === 'paid') {
        filtered = filtered.filter(m => m.paymentStatus === 'paid');
      }
    }

    setFilteredMembers(filtered);
  };

  const handleEdit = (member) => {
    setEditingMember({ ...member });
  };

  const handleSave = async () => {
    if (!editingMember) return;

    try {
      const memberRef = doc(db, 'members', editingMember.id);
      await updateDoc(memberRef, {
        fullName: editingMember.fullName,
        email: editingMember.email,
        phone: editingMember.phone,
        address: editingMember.address,
        city: editingMember.city,
        state: editingMember.state,
        pincode: editingMember.pincode,
        paymentStatus: editingMember.paymentStatus,
        active: editingMember.active,
        monthlyAmount: editingMember.monthlyAmount || 0
      });

      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      setEditingMember(null);
      toast.success('Member updated successfully');
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      await deleteDoc(doc(db, 'members', memberId));
      setMembers(members.filter(m => m.id !== memberId));
      toast.success('Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Member Database</h1>
          <p className="text-gray-600 mt-2">Manage all registered members</p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Members</option>
              <option value="active">Active Members</option>
              <option value="inactive">Inactive Members</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Payment Completed</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-sm text-gray-600">Total Members</p>
            <p className="text-2xl font-bold text-gray-900">{members.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {members.filter(m => m.active).length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600">Pending Payments</p>
            <p className="text-2xl font-bold text-yellow-600">
              {members.filter(m => m.paymentStatus === 'pending').length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600">Showing</p>
            <p className="text-2xl font-bold text-primary-600">{filteredMembers.length}</p>
          </div>
        </div>

        {/* Members Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{member.fullName}</div>
                      <div className="text-sm text-gray-500">{member.city}, {member.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail size={14} className="mr-2" />
                        {member.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone size={14} className="mr-2" />
                        {member.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.donationPreference === 'monthly' ? `₹${member.monthlyAmount}/mo` : member.donationPreference}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(member.memberSince)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No members found matching your search criteria
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Member</h2>
              <button onClick={() => setEditingMember(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={editingMember.fullName}
                    onChange={(e) => setEditingMember({...editingMember, fullName: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Monthly Amount</label>
                  <input
                    type="number"
                    value={editingMember.monthlyAmount || 0}
                    onChange={(e) => setEditingMember({...editingMember, monthlyAmount: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Payment Status</label>
                  <select
                    value={editingMember.paymentStatus}
                    onChange={(e) => setEditingMember({...editingMember, paymentStatus: e.target.value})}
                    className="input-field"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="label">Active Status</label>
                  <select
                    value={editingMember.active ? 'true' : 'false'}
                    onChange={(e) => setEditingMember({...editingMember, active: e.target.value === 'true'})}
                    className="input-field"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Address</label>
                <input
                  type="text"
                  value={editingMember.address}
                  onChange={(e) => setEditingMember({...editingMember, address: e.target.value})}
                  className="input-field"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    value={editingMember.city}
                    onChange={(e) => setEditingMember({...editingMember, city: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">State</label>
                  <input
                    type="text"
                    value={editingMember.state}
                    onChange={(e) => setEditingMember({...editingMember, state: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Pincode</label>
                  <input
                    type="text"
                    value={editingMember.pincode}
                    onChange={(e) => setEditingMember({...editingMember, pincode: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setEditingMember(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save size={20} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDatabase;
