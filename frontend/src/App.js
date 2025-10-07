import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";


function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
