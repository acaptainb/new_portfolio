function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <p className="footer-text">© 2026 Alex Chen. All rights reserved.</p>
                <div className="footer-links">
                    <a
                        href="https://github.com"
                        className="footer-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://linkedin.com"
                        className="footer-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
