import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/api/quiz/${id}/start`);
      setQuiz(res.data);
      setTimeLeft(res.data.timeLimit);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching quiz:", err);
      alert("Failed to load quiz");
      navigate("/quizzes");
    }
  };

  const handleAnswerChange = (questionId, optionId, isMultiple) => {
    if (isMultiple) {
      setAnswers((prev) => {
        const current = prev[questionId] || [];
        if (current.includes(optionId)) {
          return {
            ...prev,
            [questionId]: current.filter((id) => id !== optionId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...current, optionId],
          };
        }
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: [optionId],
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const submission = {
        answers: Object.keys(answers).map((questionId) => ({
          questionId: parseInt(questionId),
          selectedOptionIds: answers[questionId] || [],
        })),
      };

      const res = await api.post(`/api/quiz/${id}/submit`, submission);
      navigate(`/quiz-result/${res.data.id}`);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isMultipleChoice = currentQuestion.questionType === "MultipleChoice";
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3>{quiz.title}</h3>
              <p className="mb-0 text-muted">{quiz.description}</p>
            </div>
            <div className="text-end">
              <h4 className={timeLeft < 60 ? "text-danger" : "text-primary"}>
                ⏱️ {formatTime(timeLeft)}
              </h4>
              <small className="text-muted">
                Pitanje {currentQuestionIndex + 1} od {quiz.questions.length}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress mb-4" style={{ height: "10px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="card">
        <div className="card-body">
          <h4 className="mb-4">{currentQuestion.text}</h4>

          {isMultipleChoice && (
            <div className="alert alert-info mb-4">
              <small>📌 Izaberite sve tačne odgovore</small>
            </div>
          )}

          <div className="list-group">
            {currentQuestion.options.map((option) => (
              <label
                key={option.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center">
                  <input
                    type={isMultipleChoice ? "checkbox" : "radio"}
                    name={`question-${currentQuestion.id}`}
                    checked={
                      answers[currentQuestion.id]?.includes(option.id) || false
                    }
                    onChange={() =>
                      handleAnswerChange(
                        currentQuestion.id,
                        option.id,
                        isMultipleChoice
                      )
                    }
                    className="me-3"
                  />
                  <span>{option.text}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              ← Prethodno
            </button>

            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Sledeće →
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSubmit}>
                Završi kviz ✓
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="card mt-3">
        <div className="card-body">
          <h6 className="mb-3">Navigacija:</h6>
          <div className="d-flex flex-wrap gap-2">
            {quiz.questions.map((q, index) => (
              <button
                key={q.id}
                className={`btn btn-sm ${
                  index === currentQuestionIndex
                    ? "btn-primary"
                    : answers[q.id]?.length > 0
                    ? "btn-success"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;
