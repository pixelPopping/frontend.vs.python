import {
  createContext,
  useState,
  useEffect,
} from "react";
import axios from "axios";

export const AuthContext =
  createContext();

const API =
  "http://localhost:5000";

export default function AuthContextProvider({
  children,
}) {
  const [isAuth, setIsAuth] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =================================================
  // CHECK AUTH
  // =================================================
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    console.log(
      "TOKEN:",
      token
    );

    if (!token) {
      console.log(
        "NO TOKEN FOUND"
      );

      setLoading(false);

      return;
    }

    axios
      .get(`${API}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(
          "AUTH SUCCESS:"
        );

        console.log(
          res.data
        );

        console.log(
          "FIRSTNAME:",
          res.data.firstname
        );

        console.log(
          "LASTNAME:",
          res.data.lastname
        );

        console.log(
          "ROLE:",
          res.data.role
        );

        setUser(res.data);

        setIsAuth(true);
      })
      .catch((err) => {
        console.error(
          "AUTH ERROR:",
          err.response?.data ||
            err
        );

        localStorage.removeItem(
          "token"
        );

        setUser(null);

        setIsAuth(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =================================================
  // LOGIN
  // =================================================
  function login(
    userData,
    token
  ) {
    console.log(
      "LOGIN CALLED"
    );

    console.log(
      "LOGIN USER DATA:"
    );

    console.log(userData);

    console.log(
      "LOGIN TOKEN:",
      token
    );

    localStorage.setItem(
      "token",
      token
    );

    setUser(userData);

    setIsAuth(true);
  }

  // =================================================
  // LOGOUT
  // =================================================
  function logout() {
    console.log("LOGOUT");

    localStorage.removeItem(
      "token"
    );

    setUser(null);

    setIsAuth(false);
  }

  // =================================================
  // GLOBAL DEBUG
  // =================================================
  console.log(
    "AUTH CONTEXT USER:"
  );

  console.log(user);

  // =================================================
  // LOADING
  // =================================================
  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  // =================================================
  // PROVIDER
  // =================================================
  return (
    <AuthContext.Provider
      value={{
        isAuth,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
