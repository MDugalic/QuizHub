import { useState, useEffect } from "react";
import api from "../services/api";

function AdminPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalQuizzes: 0, totalResults: 0 });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "easy",
    timeLimit: 600,
    questions: []
  });

  useEffect(() => {
    fetchQuizzes();
    fetchStats();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/api/admin/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      alert("Failed to load quizzes");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateQuiz = () => {
    setShowCreateForm(true);
    setEditingQuiz(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      difficulty: "easy",
      timeLimit: 600,
      questions: []
    });
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz.id);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: []
    });
    setShowCreateForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await api.put(`/api/admin/quizzes/${editingQuiz}`, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty,
          timeLimit: formData.timeLimit
        });
        alert("Quiz updated successfully!");
      } else {
        await api.post("/api/admin/quizzes", formData);
        alert("Quiz created successfully!");
      }
      setShowCreateForm(false);
      fetchQuizzes();
      fetchStats();
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert("Failed to save quiz");
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await api.delete(`/api/admin/quizzes/${id}`);
      alert("Quiz deleted successfully!");
      fetchQuizzes();
      fetchStats();
    } catch (err) {
      console.error("Error deleting quiz:", err);
      alert("Failed to delete quiz");
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { text: "", questionType: "SingleChoice", options: [] }
      ]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push({ text: "", isCorrect: false });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Panel</h1>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Total Quizzes</h5>
              <h2>{stats.totalQuizzes}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Results</h5>
              <h2>{stats.totalResults}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Create Quiz Button */}
      <button className="btn btn-primary mb-3" onClick={handleCreateQuiz}>
        Create New Quiz
      </button>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3>{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Difficulty</label>
                  <select
                    name="difficulty"
                    className="form-control"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Time Limit (seconds)</label>
                  <input
                    type="number"
                    name="timeLimit"
                    className="form-control"
                    value={formData.timeLimit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Questions Section */}
              {!editingQuiz && (
                <>
                  <h4 className="mt-4">Questions</h4>
                  {formData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h5>Question {qIndex + 1}</h5>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteQuestion(qIndex)}
                          >
                            Delete Question
                          </button>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Question Text</label>
                          <input
                            type="text"
                            className="form-control"
                            value={question.text}
                            onChange={(e) =>
                              updateQuestion(qIndex, "text", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Question Type</label>
                          <select
                            className="form-control"
                            value={question.questionType}
                            onChange={(e) =>
                              updateQuestion(qIndex, "questionType", e.target.value)
                            }
                          >
                            <option value="SingleChoice">Single Choice</option>
                            <option value="MultipleChoice">Multiple Choice</option>
                            <option value="TrueFalse">True/False</option>
                            <option value="FillInTheBlank">Fill in the Blank</option>
                          </select>
                        </div>

                        <h6>Options</h6>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Option text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(qIndex, oIndex, "text", e.target.value)
                              }
                              required
                            />
                            <div className="input-group-text">
                              <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={(e) =>
                                  updateOption(qIndex, oIndex, "isCorrect", e.target.checked)
                                }
                              />
                              <label className="ms-2">Correct</label>
                            </div>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => deleteOption(qIndex, oIndex)}
                            >
                              X
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => addOption(qIndex)}
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-secondary mb-3"
                    onClick={addQuestion}
                  >
                    Add Question
                  </button>
                </>
              )}

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingQuiz ? "Update Quiz" : "Create Quiz"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      <h3>All Quizzes</h3>
      <div className="row">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text">{quiz.description}</p>
                <p className="mb-1">
                  <strong>Category:</strong> {quiz.category}
                </p>
                <p className="mb-1">
                  <strong>Difficulty:</strong> {quiz.difficulty}
                </p>
                <p className="mb-1">
                  <strong>Time Limit:</strong> {quiz.timeLimit}s
                </p>
                <p className="mb-3">
                  <strong>Questions:</strong> {quiz.questions?.length || 0}
                </p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEditQuiz(quiz)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
