// src/components/LoadingIndicator.js
import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="cute-bouncing-loader">
      <div className="dot dot-1"></div>
      <div className="dot dot-2"></div>
      <div className="dot dot-3"></div>

      <style>{`
        .cute-bouncing-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 20px;
        }

        .dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          animation: cute-bounce 0.6s infinite alternate ease-in-out;
        }

        .dot-1 {
          background-color: #92d16c; 
          animation-delay: 0s;
        }
        
        .dot-2 {
          background-color: #5acac2; 
          animation-delay: 0.2s;
        }
        
        .dot-3 {
          background-color: #f2e39c; 
          animation-delay: 0.4s;
        }

        @keyframes cute-bounce {
          to {
            transform: translateY(-16px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
