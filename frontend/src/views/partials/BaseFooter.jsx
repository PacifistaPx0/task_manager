import React from "react";

function BaseFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} TaskManager. All rights reserved.
        </p>
        <ul className="flex justify-center space-x-6 mt-4 text-sm">
          <li>
            <a className="text-gray-500 hover:text-gray-800" href="/privacy-policy">
              Privacy Policy
            </a>
          </li>
          <li>
            <a className="text-gray-500 hover:text-gray-800" href="/terms-of-service">
              Terms of Service
            </a>
          </li>
          <li>
            <a className="text-gray-500 hover:text-gray-800" href="/contact">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default BaseFooter;
