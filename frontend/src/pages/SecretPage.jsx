import { useState, useEffect } from 'react';
import { apiUrl } from '../api/api';
import DashboardLayout from '../dashboard/DashboardLayout';

function SecretPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('secretToken');

        if (!token) {
            setError('Not authorized');
            return;
        }

        // Verify token validity with a simple check
        fetch(apiUrl('/x'), {
            headers: {
                'x-secret-token': token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(() => {
                setIsAuthorized(true);
            })
            .catch(err => {
                setError(err.message);
            });
    }, []);

    if (error) {
        return (
            <section className="section">
                <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <h1>404</h1>
                    <p>The page you are looking for does not exist.</p>
                </div>
            </section>
        );
    }

    if (!isAuthorized) {
        return (
            <div style={{ height: '100vh', background: '#050507', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2ff', fontFamily: 'monospace' }}>
                INITIATING SECURE HANDSHAKE...
            </div>
        );
    }

    // Render the full dashboard layout which takes over the screen
    return <DashboardLayout />;
}

export default SecretPage;