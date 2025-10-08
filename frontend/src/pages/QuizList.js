import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, quizzes]);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/api/quiz");
      setQuizzes(res.data);
      setFilteredQuizzes(res.data);

      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.map((q) => q.category))];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...quizzes];

    if (filters.category) {
      filtered = filtered.filter((q) => q.category === filters.category);
    }

    if (filters.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filters.difficulty);
    }

    if (filters.search) {
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          q.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredQuizzes(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: "success",
      medium: "warning",
      hard: "danger",
    };
    return badges[difficulty] || "secondary";
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: "Lako",
      medium: "Srednje",
      hard: "Teako",
    };
    return labels[difficulty] || difficulty;
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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dostupni Kvizovi</h1>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="= Pretra~i kvizove..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">Sve kategorije</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value)
                }
              >
                <option value="">Svi nivoi te~ine</option>
                <option value="easy">Lako</option>
                <option value="medium">Srednje</option>
                <option value="hard">Teako</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      {filteredQuizzes.length === 0 ? (
        <div className="alert alert-info">
          Nema dostupnih kvizova koji odgovaraju filterima.
        </div>
      ) : (
        <div className="row">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{quiz.title}</h5>
                    <span
                      className={`badge bg-${getDifficultyBadge(
                        quiz.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(quiz.difficulty)}
                    </span>
                  </div>

                  <p className="card-text text-muted small flex-grow-1">
                    {quiz.description}
                  </p>

                  <div className="mb-3">
                    <small className="text-muted d-block">
                      =Ú Kategorija: <strong>{quiz.category}</strong>
                    </small>
                    <small className="text-muted d-block">
                      ñ Vrijeme: <strong>{Math.floor(quiz.timeLimit / 60)} min</strong>
                    </small>
                    <small className="text-muted d-block">
                      =Ý Pitanja: <strong>{quiz.questions?.length || 0}</strong>
                    </small>
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/quiz/${quiz.id}/take`)}
                  >
                    Zaponi kviz ’
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizList;
