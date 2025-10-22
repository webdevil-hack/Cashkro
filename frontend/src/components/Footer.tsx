import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">About CashKaro</h3>
            <p className="text-sm mb-4">
              India's largest cashback and coupons website. Save money on every online purchase with our exclusive deals and offers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/stores" className="hover:text-white transition">
                  All Stores
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition">
                  Hot Deals
                </Link>
              </li>
              <li>
                <Link to="/coupons" className="hover:text-white transition">
                  Coupons
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/stores?category=Fashion" className="hover:text-white transition">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/stores?category=Electronics" className="hover:text-white transition">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/stores?category=Travel" className="hover:text-white transition">
                  Travel
                </Link>
              </li>
              <li>
                <Link to="/stores?category=Food" className="hover:text-white transition">
                  Food & Dining
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} CashKaro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
