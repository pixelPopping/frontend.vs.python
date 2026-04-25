import { NavLink } from "react-router";

function Navigation () {
    return (
        <div className="Navigation">
            <nav className="navbar">
                <ul className="unordered-list">
                    <li><NavLink to="/" className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>Home Page</NavLink></li>
                    <li><NavLink to="/Mission" className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>Mission</NavLink></li>
                    <li><NavLink to="/detailmission" className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>Missiondetail</NavLink></li>
                    <li><NavLink to="/Contact" className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>Contact</NavLink></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navigation;