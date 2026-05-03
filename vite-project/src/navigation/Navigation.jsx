import { NavLink } from "react-router-dom";

function Navigation () {
    return (
        <div className="Navigation">
            <nav className="navbar">
                <ul className="unordered-list">
                    <li><NavLink to="/" className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>Home Page</NavLink></li>
                    <li><NavLink to="/mission" className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>Mission</NavLink></li>
                    <li><NavLink to="/savedMissions" className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>Saved Mission</NavLink></li>
                    <li><NavLink to="/contact" className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>Contact</NavLink></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navigation;