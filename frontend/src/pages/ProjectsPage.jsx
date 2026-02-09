import { useState, useEffect } from 'react';
import { fetchProjects } from '../api/api';
import ProjectCard from '../components/ProjectCard';

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await fetchProjects();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadProjects();
    }, []);

    return (
        <>
            <header className="page-header">
                <div className="container">
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">
                        A collection of my work in cybersecurity, web development, and software engineering.
                    </p>
                </div>
            </header>

            <section className="section">
                <div className="container">
                    {loading && (
                        <div className="loading">
                            <div className="loading-spinner"></div>
                        </div>
                    )}

                    {error && (
                        <p className="error">Failed to load projects. Please try again later.</p>
                    )}

                    {!loading && !error && (
                        <div className="card-grid">
                            {projects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default ProjectsPage;
