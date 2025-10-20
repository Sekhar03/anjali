import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    donationPreference: 'monthly',
    monthlyAmount: '500',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Save member application to Firestore
      const memberData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        donationPreference: formData.donationPreference,
        monthlyAmount: formData.donationPreference === 'monthly' ? parseInt(formData.monthlyAmount) : 0,
        paymentStatus: 'pending',
        applicationStatus: 'pending', // New field for approval workflow
        applicationDate: serverTimestamp(),
        approvedBy: null,
        approvedDate: null,
        rejectionReason: null,
        memberSince: null, // Will be set when approved
        lastPaymentDate: null,
        active: false // Will be true when approved
      };

      await addDoc(collection(db, 'members'), memberData);

      setSuccess(true);
      toast.success('Application submitted! Awaiting admin approval.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        donationPreference: 'monthly',
        monthlyAmount: '500',
        agreeToTerms: false
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full card p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your membership application has been received. Our admin team will review it shortly. You'll be notified once approved.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-primary w-full"
          >
            Register Another Member
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <UserPlus className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Join Our Community</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Become a member and be part of our vibrant Durga Puja celebration community
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Membership Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Exclusive Access', desc: 'Priority access to all Durga Puja events and ceremonies' },
              { title: 'Community Network', desc: 'Connect with 500+ like-minded devotees and families' },
              { title: 'Regular Updates', desc: 'Stay informed about upcoming events and activities' }
            ].map((benefit, idx) => (
              <div key={idx} className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Member Registration Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation Preference */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Donation Preference</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Contribution Type *</label>
                    <select
                      name="donationPreference"
                      value={formData.donationPreference}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="monthly">Monthly Donation</option>
                      <option value="one-time">One-time Donation</option>
                      <option value="none">No Donation (Membership Only)</option>
                    </select>
                  </div>

                  {formData.donationPreference === 'monthly' && (
                    <div>
                      <label className="label">Monthly Amount *</label>
                      <select
                        name="monthlyAmount"
                        value={formData.monthlyAmount}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="500">₹500 per month</option>
                        <option value="1000">₹1000 per month</option>
                        <option value="2000">₹2000 per month</option>
                        <option value="5000">₹5000 per month</option>
                      </select>
                      <p className="text-sm text-gray-600 mt-2">
                        Monthly donation helps us maintain consistent community activities
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  required
                />
                <label className="text-sm text-gray-700">
                  I agree to the terms and conditions and consent to receive updates about events and activities from Anjali Connect. *
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? 'Submitting...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
