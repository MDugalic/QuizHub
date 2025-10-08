import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import AdminPanel from "./pages/AdminPanel";
import TakeQuiz from "./pages/TakeQuiz";
import QuizResult from "./pages/QuizResult";
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
          <Route path="/quiz/:id/take" element={<TakeQuiz />} />
          <Route path="/quiz-result/:resultId" element={<QuizResult />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<QuizList />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
