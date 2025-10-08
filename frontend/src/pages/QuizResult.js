import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function QuizResult() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      // Ovaj endpoint ćemo dodati kasnije
      const res = await api.get(`/api/results/${resultId}`);
      setResult(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching result:", err);
      setLoading(false);
    }
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

  if (!result) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Rezultat nije pronađen.
        </div>
      </div>
    );
  }

  const percentage = result.percentage || 0;
  const passed = percentage >= 60;

  return (
    <div className="container mt-4">
      {/* Result Header */}
      <div className={`card mb-4 border-${passed ? "success" : "danger"}`}>
        <div className="card-body text-center">
          <h2 className="mb-3">
            {passed ? "🎉 Čestitamo!" : "😔 Pokušajte ponovo"}
          </h2>
          <h1 className={`display-1 text-${passed ? "success" : "danger"}`}>
            {percentage.toFixed(0)}%
          </h1>
          <h4 className="text-muted mt-3">
            {result.correctAnswers} / {result.totalQuestions} tačnih odgovora
          </h4>
          <p className="text-muted mb-0">
            Kviz: <strong>{result.quizTitle}</strong>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">Tačni odgovori</h6>
              <h3 className="text-success">{result.correctAnswers}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">Netačni odgovori</h6>
              <h3 className="text-danger">
                {result.totalQuestions - result.correctAnswers}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">Datum</h6>
              <h6>{new Date(result.dateTaken).toLocaleDateString("sr-RS")}</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-3 justify-content-center">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/quizzes")}
        >
          Nazad na kvizove
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/my-results")}
        >
          Moji rezultati
        </button>
        <button
          className="btn btn-success"
          onClick={() => navigate(`/quiz/${result.quizId}/take`)}
        >
          Pokušaj ponovo
        </button>
      </div>
    </div>
  );
}

export default QuizResult;
