import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/projects', label: 'Projects' },
        { path: '/experience', label: 'Experience' },
        { path: '/contact', label: 'Contact' }
    ];

    return (
        <nav className="nav">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <span className="nav-logo-icon">⚡</span>
                    <span>AC</span>
                </Link>

                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    {navLinks.map(({ path, label }) => (
                        <li key={path}>
                            <Link
                                to={path}
                                className={`nav-link ${isActive(path) ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <button
                    className="nav-toggle"
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

export default NavBar;
