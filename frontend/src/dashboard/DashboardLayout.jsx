import { useState } from 'react';
import './Dashboard.css';
import IntelligenceModule from './components/IntelligenceModule';
import NotesModule from './components/NotesModule';
import VaultModule from './components/VaultModule';

function DashboardLayout() {
    const [activeModule, setActiveModule] = useState('intelligence');

    const renderModule = () => {
        switch (activeModule) {
            case 'intelligence': return <IntelligenceModule />;
            case 'notes': return <NotesModule />;
            case 'vault': return <VaultModule />;
            default: return <IntelligenceModule />;
        }
    };

    return (
        <div className="dashboard-root">
            <div className="dashboard-bg"></div>

            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '2px', color: 'var(--dash-accent)' }}>CYBER_VAULT V.1.0</span>
                    </div>
                    <div className="system-status">
                        <span className="status-dot"></span>
                        <span>SYSTEM_ONLINE</span>
                        <span style={{ marginLeft: '20px', color: 'var(--dash-text-muted)' }}>SECURE_CONNECTION_ESTABLISHED</span>
                    </div>
                </header>

                <aside className="dashboard-sidebar">
                    <nav style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <button
                            className={`nav-btn ${activeModule === 'intelligence' ? 'active' : ''}`}
                            onClick={() => setActiveModule('intelligence')}
                        >
                            [INTEL] // MESSAGES
                        </button>
                        <button
                            className={`nav-btn ${activeModule === 'notes' ? 'active' : ''}`}
                            onClick={() => setActiveModule('notes')}
                        >
                            [ARCHV] // NOTES
                        </button>
                        <button
                            className={`nav-btn ${activeModule === 'vault' ? 'active' : ''}`}
                            onClick={() => setActiveModule('vault')}
                        >
                            [VAULT] // STORAGE
                        </button>

                        <div style={{ marginTop: 'auto', padding: '20px 0', fontSize: '10px', color: 'var(--dash-text-muted)' }}>
                            LOCAL_TIME: {new Date().toLocaleTimeString()}<br />
                            UPTIME: 0h 42m
                        </div>
                    </nav>
                </aside>

                <main className="dashboard-content">
                    {renderModule()}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
