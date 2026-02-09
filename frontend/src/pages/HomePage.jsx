import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <span className="hero-tagline">Computer Science & Cybersecurity</span>
                    <h1 className="hero-name">Alex Chen</h1>
                    <p className="hero-title">Building secure systems that make a difference</p>
                    <p className="hero-description">
                        I'm a passionate computer science student specializing in cybersecurity.
                        I love exploring vulnerabilities, building secure applications, and competing
                        in CTF challenges. Currently focused on network security and ethical hacking.
                    </p>
                    <div className="hero-cta">
                        <Link to="/projects" className="btn btn-primary">
                            View My Projects
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/contact" className="btn btn-secondary">
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomePage;
