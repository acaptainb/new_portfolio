import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <span className="hero-tagline">Computer Engineering</span>
                    <h1 className="hero-name">Abdulaziz Abbasov</h1>
                    <p className="hero-title">Building full-stack and secure applications</p>
                    <p className="hero-description">
                        I'm a Computer Engineering student focused on full-stack development and cybersecurity.
                        I enjoy designing practical products, building reliable backend systems, and shipping
                        polished user experiences.
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