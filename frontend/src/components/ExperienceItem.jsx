function ExperienceItem({ item }) {
    const { title, description, date } = item;

    return (
        <article className="experience-item">
            <div className="experience-content">
                <h3 className="experience-title">{title}</h3>
                <p className="experience-description">{description}</p>
            </div>
            {date && <span className="experience-date">{date}</span>}
        </article>
    );
}

export default ExperienceItem;
