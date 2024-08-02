import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <Image src="/logo.jpg" alt="Jetsetgo Logo" width={100} height={100} className="rounded-full" />
            <p className="mt-4">
              Jetsetgo is your one-stop solution for booking flights, hotels, and discovering new places to explore.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <Link href="/" className="hover:text-gray-400">Home</Link>
              </li>
              <li className="mb-2">
                <Link href="/search-flights" className="hover:text-gray-400">Flights</Link>
              </li>
              <li className="mb-2">
                <Link href="/search-hotels" className="hover:text-gray-400">Hotels</Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="hover:text-gray-400">About Us</Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-gray-400">
                <FaFacebookF size={20} />
              </Link>
              <Link href="https://twitter.com" className="hover:text-gray-400">
                <FaTwitter size={20} />
              </Link>
              <Link href="https://instagram.com" className="hover:text-gray-400">
                <FaInstagram size={20} />
              </Link>
              <Link href="https://linkedin.com" className="hover:text-gray-400">
                <FaLinkedinIn size={20} />
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="font-bold mb-4">Contact Us</h3>
            <p>
              1234 Travel Street<br />
              Adventure City, ST 56789<br />
              Email: info@jetsetgo.com<br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>&copy; 2024 Jetsetgo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
