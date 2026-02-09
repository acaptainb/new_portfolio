function ProjectCard({ project }) {
    const { title, description, tech_stack, link } = project;
    const techTags = tech_stack.split(', ');

    return (
        <article className="card">
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            <div className="card-tags">
                {techTags.map((tech, index) => (
                    <span key={index} className="tag">{tech}</span>
                ))}
            </div>
            {link && (
                <a
                    href={link}
                    className="card-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </a>
            )}
        </article>
    );
}

export default ProjectCard;
