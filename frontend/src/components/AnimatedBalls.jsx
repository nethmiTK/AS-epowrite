import React from 'react';

const AnimatedBalls = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden"> {/* Lower z-index value */}
      <div className="absolute w-10 h-10 bg-pink-400 opacity-30 rounded-full animate-bounce-slow top-1/4 left-1/3"></div>
      <div className="absolute w-6 h-6 bg-purple-400 opacity-30 rounded-full animate-ping top-3/4 left-1/2"></div>
      <div className="absolute w-8 h-8 bg-indigo-400 opacity-30 rounded-full animate-bounce-slow-reverse top-1/2 left-1/4"></div>

      {/* Add more if needed */}
      <style>
        {`
          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
          }
          @keyframes bounceSlowReverse {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(30px); }
          }
          .animate-bounce-slow {
            animation: bounceSlow 6s infinite ease-in-out;
          }
          .animate-bounce-slow-reverse {
            animation: bounceSlowReverse 6s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default AnimatedBalls;
