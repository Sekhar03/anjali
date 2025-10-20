import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Anjali Connect</h3>
            <p className="text-gray-400 text-sm">
              Celebrating Durga Puja with devotion, bringing our community together through faith and tradition.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/payments" className="text-gray-400 hover:text-white transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Become a Member
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm">
                  123 Durga Temple Road, Kolkata, West Bengal 700001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@anjaliconnect.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive updates about our events and activities.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-primary-500 focus:outline-none"
              />
              <button className="w-full btn-primary">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Anjali Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
