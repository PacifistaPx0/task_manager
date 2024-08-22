import React from "react";

function BaseFooter() {
  return (
    <footer className="bg-dark text-white mt-auto py-4">
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} TaskManager. All rights reserved.</p>
        <ul className="list-inline">
          <li className="list-inline-item">
            <a className="text-white" href="/privacy-policy">
              Privacy Policy
            </a>
          </li>
          <li className="list-inline-item">
            <a className="text-white" href="/terms-of-service">
              Terms of Service
            </a>
          </li>
          <li className="list-inline-item">
            <a className="text-white" href="/contact">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default BaseFooter;