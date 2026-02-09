import { useState, useEffect } from 'react';
import { fetchExperience } from '../api/api';
import ExperienceItem from '../components/ExperienceItem';

const categoryInfo = {
    awards: { title: 'Awards & Certifications', icon: '🏆' },
    competitions: { title: 'Competitions', icon: '🎯' },
    clubs: { title: 'Clubs & Organizations', icon: '👥' }
};

function ExperiencePage() {
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadExperience() {
            try {
                const data = await fetchExperience();
                setExperience(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadExperience();
    }, []);

    return (
        <>
            <header className="page-header">
                <div className="container">
                    <h1 className="page-title">Experience & Achievements</h1>
                    <p className="page-subtitle">
                        Awards, competitions, and organizations that have shaped my journey.
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
                        <p className="error">Failed to load experience. Please try again later.</p>
                    )}

                    {!loading && !error && experience && (
                        <>
                            {Object.entries(categoryInfo).map(([category, info]) => {
                                const items = experience[category];
                                if (!items || items.length === 0) return null;

                                return (
                                    <div key={category} className="experience-section">
                                        <div className="experience-category">
                                            <span className="experience-icon">{info.icon}</span>
                                            <h2 className="experience-category-title">{info.title}</h2>
                                        </div>
                                        <div className="experience-list">
                                            {items.map(item => (
                                                <ExperienceItem key={item.id} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

export default ExperiencePage;
