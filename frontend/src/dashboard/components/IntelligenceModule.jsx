import { useState, useEffect } from 'react';
import { apiUrl } from '../../api/api';

function IntelligenceModule() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(apiUrl('/secret/contact-messages'), {
            headers: { 'x-secret-token': sessionStorage.getItem('secretToken') }
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) setMessages(result.data);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="module-panel">
            <h2 className="module-title">Intelligence Feed // Contact Messages</h2>
            {loading ? (
                <p>Scanning signals...</p>
            ) : (
                <div className="intelligence-list">
                    {messages.length === 0 ? (
                        <p>No incoming transmissions detected.</p>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className="message-item">
                                <div className="message-header">
                                    <span className="message-author">{msg.name} [{msg.email}]</span>
                                    <span className="message-date">{new Date(msg.created_at).toLocaleString()}</span>
                                </div>
                                <p className="message-body">{msg.message}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default IntelligenceModule;