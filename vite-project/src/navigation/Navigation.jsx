import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navigation() {

    const { isAuth, user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">

            <NavLink to="/">Home</NavLink>

            {isAuth && user?.role === 'captain' && (
                <NavLink to="/captain">Captain Dashboard</NavLink>
            )}

            {isAuth && user?.role === 'crew' && (
                <NavLink to="/crew">Crew Dashboard</NavLink>
            )}

            {!isAuth && (
                <>
                    <NavLink to="/signin">Login</NavLink>
                    <NavLink to="/signup">Register</NavLink>
                </>
            )}

            {isAuth && (
                <button onClick={logout}>Logout</button>
            )}

        </nav>
    );
}

export default Navigation;