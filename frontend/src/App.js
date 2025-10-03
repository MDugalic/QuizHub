import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";


function App() {
  return (
    <div className="container mt-5">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quizzes" element={<QuizList />} />
      </Routes>
    </div>
  );
}

export default App;
