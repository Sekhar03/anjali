import { useState } from 'react';
import { CreditCard, Heart, Users, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const Payments = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [500, 1000, 2500, 5000];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const finalAmount = customAmount || amount;
    
    if (!finalAmount || finalAmount < 100) {
      toast.error('Please enter an amount of at least ₹100');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Save payment record to Firestore
      const paymentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: parseInt(finalAmount),
        type: donationType,
        message: formData.message,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'payments'), paymentData);

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: parseInt(finalAmount) * 100, // Convert to paise
        currency: 'INR',
        name: 'Anjali Connect',
        description: `${donationType === 'monthly' ? 'Monthly' : 'One-time'} Donation`,
        handler: async function (response) {
          // Payment successful
          toast.success('Thank you for your generous donation!');
          
          // Reset form
          setFormData({ name: '', email: '', phone: '', message: '' });
          setAmount('');
          setCustomAmount('');
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#ea580c'
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Support Our Community</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Your generous donations help us organize grand Durga Puja celebrations and support our community initiatives
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users />, title: 'Community Support', desc: 'Help organize events for 500+ members' },
              { icon: <Heart />, title: 'Cultural Preservation', desc: 'Keep traditions alive for future generations' },
              { icon: <Check />, title: 'Transparent Usage', desc: 'Every rupee is accounted for and tracked' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Form Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Make a Donation
            </h2>

            <form onSubmit={handlePayment}>
              {/* Donation Type */}
              <div className="mb-8">
                <label className="label">Donation Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDonationType('one-time')}
                    className={`p-4 rounded-lg border-2 font-semibold transition-colors ${
                      donationType === 'one-time'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    One-time Donation
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('monthly')}
                    className={`p-4 rounded-lg border-2 font-semibold transition-colors ${
                      donationType === 'monthly'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Monthly Donation
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="label">Select Amount</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {predefinedAmounts.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`p-4 rounded-lg border-2 font-semibold transition-colors ${
                        amount === amt && !customAmount
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount('');
                  }}
                  className="input-field"
                  min="100"
                />
              </div>

              {/* Personal Information */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email *</label>
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
                    <label className="label">Phone *</label>
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
                <div>
                  <label className="label">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field"
                    placeholder="Leave a message..."
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <CreditCard size={20} />
                <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
              </button>

              <p className="text-sm text-gray-600 text-center mt-4">
                Your payment is secured by Razorpay. We accept all major cards and UPI.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payments;
