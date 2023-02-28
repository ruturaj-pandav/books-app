import "./App.css";

import Homepage from "./components/Homepage";
import SubjectBooks from "./components/SubjectBooks";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App bg-gray-50 ">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/subject/:subject" element={<SubjectBooks />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
