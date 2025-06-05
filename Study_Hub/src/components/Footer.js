// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="border-top footer text-muted py-3 mt-4">
      <div className="container text-center">
        &copy; {new Date().getFullYear()} - Study Hub
      </div>
    </footer>
  );
};

export default Footer;
