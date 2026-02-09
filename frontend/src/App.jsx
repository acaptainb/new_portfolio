import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';

// Lazy load the secret page
const SecretPage = lazy(() => import('./pages/SecretPage'));

function App() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const navigate = useNavigate();

    const handleLock = () => {
        sessionStorage.removeItem('secretToken');
        sessionStorage.removeItem('secretTokenExpiry');
        setIsUnlocked(false);

        // Redirect away if currently on secret route
        if (window.location.pathname === '/x') {
            navigate('/');
        }
    };

    useEffect(() => {
        // Check for existing token
        const token = sessionStorage.getItem('secretToken');
        const expiry = sessionStorage.getItem('secretTokenExpiry');

        if (token && expiry) {
            const expiryTime = parseInt(expiry, 10);
            if (Date.now() < expiryTime) {
                setIsUnlocked(true);

                const timeLeft = expiryTime - Date.now();
                const timer = setTimeout(() => {
                    handleLock();
                }, timeLeft);

                return () => clearTimeout(timer);
            } else {
                handleLock();
            }
        }

        // Listen for custom unlock events
        const handleUnlockEvent = (e) => {
            const { token } = e.detail;
            const duration = 60 * 60 * 1000; // 60 mins (Testing)
            const expiryTime = Date.now() + duration;

            sessionStorage.setItem('secretToken', token);
            sessionStorage.setItem('secretTokenExpiry', expiryTime.toString());
            setIsUnlocked(true);

            navigate('/x');
        };

        window.addEventListener('secret-unlocked', handleUnlockEvent);
        return () => {
            window.removeEventListener('secret-unlocked', handleUnlockEvent);
        };
    }, [navigate]);

    return (
        <>
            <NavBar />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/experience" element={<ExperiencePage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Dynamic Route Injection */}
                    {isUnlocked && (
                        <Route
                            path="/x"
                            element={
                                <Suspense fallback={null}>
                                    <SecretPage />
                                </Suspense>
                            }
                        />
                    )}

                    {/* Catch-all 404 */}
                    <Route path="*" element={
                        <section className="section">
                            <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                                <h1>404</h1>
                                <p>Not Found</p>
                            </div>
                        </section>
                    } />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;
