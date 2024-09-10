import { FacebookOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined } from '@ant-design/icons';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-4 mb-4">
          {/* Social Media Icons */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined className="text-white text-2xl hover:text-blue-500" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined className="text-white text-2xl hover:text-blue-400" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <InstagramOutlined className="text-white text-2xl hover:text-pink-500" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <GithubOutlined className="text-white text-2xl hover:text-gray-500" />
          </a>
        </div>

        {/* Quick Links */}
        <div className="mb-4">
          <a href="/about" className="text-white hover:text-gray-400 mx-2">About Us</a>
          <a href="/contact" className="text-white hover:text-gray-400 mx-2">Contact</a>
          <a href="/privacy" className="text-white hover:text-gray-400 mx-2">Privacy Policy</a>
          <a href="/terms" className="text-white hover:text-gray-400 mx-2">Terms of Service</a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
