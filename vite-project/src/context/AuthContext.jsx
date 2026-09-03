import {
  createContext,
  useState,
  useEffect,
} from "react";

import client from "../api/client";

export const AuthContext = createContext();

export default function AuthContextProvider({
  children,
}) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =================================================
  // CHECK AUTH
  // =================================================
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      if (!token) {
        console.log("NO TOKEN FOUND");
        setLoading(false);
        return;
      }

      // =================================================
      // DEMO TOKEN
      // =================================================
      if (token.startsWith("demo-token-")) {
        console.log("✅ DEMO TOKEN FOUND");

        const role = token.replace(
          "demo-token-",
          "",
        );

        // -------------------------------------------------
        // Vaste demo captain
        // -------------------------------------------------
        if (role === "captain") {
          const demoCaptain = {
            id: "demo-captain",
            username: "demoCaptain",
            email: "captain@novinaut.demo",
            role: "captain",
          };

          setUser(demoCaptain);
          setIsAuth(true);
          setLoading(false);

          return;
        }

        // -------------------------------------------------
        // Vaste demo crew
        // -------------------------------------------------
        if (role === "crew") {
          const demoCrew = {
            id: "demo-crew",
            username: "demoCrew",
            email: "crew@novinaut.demo",
            role: "crew",
          };

          setUser(demoCrew);
          setIsAuth(true);
          setLoading(false);

          return;
        }

        // -------------------------------------------------
        // Zelf geregistreerde demo-user
        // -------------------------------------------------
        if (role === "user") {
          try {
            const registeredUsers =
              JSON.parse(
                localStorage.getItem(
                  "novinaut_demo_registered_users",
                ) || "[]",
              );

            // De laatst geregistreerde gebruiker
            const registeredUser =
              registeredUsers[
                registeredUsers.length - 1
              ];

            if (registeredUser) {
              const {
                password: _,
                ...userWithoutPassword
              } = registeredUser;

              setUser(userWithoutPassword);
              setIsAuth(true);
              setLoading(false);

              return;
            }
          } catch (error) {
            console.error(
              "DEMO USER ERROR:",
              error,
            );
          }
        }

        // Onbekend demo-token
        console.warn(
          "Unknown demo token.",
        );

        localStorage.removeItem("token");
        setUser(null);
        setIsAuth(false);
        setLoading(false);

        return;
      }

      // =================================================
      // ECHTE BACKEND TOKEN
      // =================================================
      try {
        const response =
          await client.get("/me");

        console.log(
          "AUTH SUCCESS:",
          response.data,
        );

        setUser(response.data);
        setIsAuth(true);
      } catch (error) {
        console.error(
          "AUTH ERROR:",
          error?.response?.data || error,
        );

        localStorage.removeItem("token");
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  // =================================================
  // LOGIN
  // =================================================
  function login(userData, token) {
    console.log("LOGIN CALLED");
    console.log(
      "LOGIN USER DATA:",
      userData,
    );

    localStorage.setItem(
      "token",
      token,
    );

    setUser(userData);
    setIsAuth(true);
  }

  // =================================================
  // LOGOUT
  // =================================================
  function logout() {
    console.log("LOGOUT");

    localStorage.removeItem("token");

    setUser(null);
    setIsAuth(false);
  }

  // =================================================
  // LOADING
  // =================================================
  if (loading) {
    return <div>Loading...</div>;
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