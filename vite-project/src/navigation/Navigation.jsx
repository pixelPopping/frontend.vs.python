import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./Navigation.module.css";

function Navigation() {
  const { isAuth, user, logout } =
    useContext(AuthContext);

  return (
    <div className={styles.body}>
      <header className={styles.outernavigation}>
        <div className={styles.innernavigation}>
          <nav className={styles.navlinks}>
            <NavLink to="/">Home</NavLink>

            {isAuth &&
              user?.role === "captain" && (
                <NavLink to="/captain-dashboard">
                  Captain Dashboard
                </NavLink>
              )}

            {isAuth &&
              user?.role === "crew" && (
                <NavLink to="/crew-dashboard">
                  Crew Dashboard
                </NavLink>
              )}

            {!isAuth && (
              <>
                <NavLink to="/signin">
                  Login
                </NavLink>

                <NavLink to="/signup">
                  Register
                </NavLink>
              </>
            )}

            {isAuth && (
              <button
                className={styles.logout}
                onClick={logout}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Navigation;