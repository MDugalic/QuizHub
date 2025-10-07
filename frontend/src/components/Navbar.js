import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedProfileImage = localStorage.getItem("profileImage");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsLoggedIn(true);
      setProfileImage(storedProfileImage);
      setUsername(storedUsername);
      // Dekoduj JWT token da provjeris ulogu
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      } catch (err) {
        console.error("Error parsing token", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profileImage");
    setIsLoggedIn(false);
    setUserRole(null);
    setUsername("");
    setProfileImage(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/quizzes">
          QuizHub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/quizzes">
                    Quizzes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-results">
                    My Results
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                {userRole === "Admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item d-flex align-items-center">
                  {profileImage ? (
                    <img
                      src={`http://localhost:5029${profileImage}`}
                      alt={username}
                      className="rounded-circle me-2"
                      style={{ width: "35px", height: "35px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                      style={{ width: "35px", height: "35px" }}
                    >
                      {username ? username.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="text-white me-3">{username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
