import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navigation() {
    const { isAuth, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="Navigation">

            <nav className="navbar">

                <ul className="unordered-list">

                    <li>
                        <NavLink to="/" className={({ isActive }) =>
                            isActive ? "active-link" : "default-link"
                        }>
                            Home Page
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/mission" className={({ isActive }) =>
                            isActive ? "active-link" : "default-link"
                        }>
                            Mission
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/savedMissions" className={({ isActive }) =>
                            isActive ? "active-link" : "default-link"
                        }>
                            Saved Mission
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/contact" className={({ isActive }) =>
                            isActive ? "active-link" : "default-link"
                        }>
                            Contact
                        </NavLink>
                    </li>

                </ul>

                {/* 🔐 AUTH SECTION */}
                <div className="auth-buttons">

                    {!isAuth ? (
                        <>
                            <button onClick={() => navigate("/signin")}>
                                Login
                            </button>

                            <button onClick={() => navigate("/signup")}>
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="user-info">
                                👨‍🚀 {user?.email}
                            </span>

                            <button onClick={logout}>
                                Logout
                            </button>
                        </>
                    )}

                </div>

            </nav>

        </div>
    );
}

export default Navigation;