import * as React from "react";

export const AppTitle: React.FC = () => {
  return (
    <div className="fixed top-4 left-4 flex items-center gap-2.5 z-50 select-none">
      <div className="relative group w-8 h-8 mt-1.5">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        {/* Convex logo spinning in background */}
        <img
          src="/convex.svg"
          alt="Convex Logo"
          className="absolute inset-0 w-full h-full transform group-hover:rotate-180 transition-transform duration-1000"
        />
        {/* Droplet logo scaling on top */}
        <img
          src="/dropvex-logo.svg"
          alt="Dropvex Logo"
          className="absolute inset-0 w-full h-full transform hover:scale-110 transition-all duration-300"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>
      <h1 className="text-4xl font-light tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hover:from-blue-600 hover:to-blue-400 transition-all duration-300 select-none">
        Drop<span className="font-semibold">vex</span>
      </h1>
    </div>
  );
};
