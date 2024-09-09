import React from 'react';
import BaseHeader from './BaseHeader';
import BaseFooter from './BaseFooter';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header at the top */}
      <BaseHeader />

      {/* Main content, grows as needed */}
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>

      {/* Footer at the bottom */}
      <BaseFooter />
    </div>
  );
};

export default Layout;
