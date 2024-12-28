import React from "react";
import Board from "./components/Board";

const App = () => {
  return (
    <div className="h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-5">
        Project Management Tool
      </h1>
      <Board />
    </div>
  );
};

export default App;
