import { useState, useEffect } from 'react';
import { apiUrl } from '../../api/api';

function NotesModule() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = () => {
        fetch(apiUrl('/secret/notes'), {
            headers: { 'x-secret-token': sessionStorage.getItem('secretToken') }
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) setNotes(result.data);
            })
            .finally(() => setLoading(false));
    };

    const handleSave = () => {
        if (!newNote.trim()) return;

        fetch(apiUrl('/secret/notes'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-secret-token': sessionStorage.getItem('secretToken')
            },
            body: JSON.stringify({ content: newNote })
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setNewNote('');
                    loadNotes();
                }
            });
    };

    return (
        <div className="module-panel">
            <h2 className="module-title">Personal Archive // Protected Notes</h2>

            <div style={{ marginBottom: '30px' }}>
                <textarea
                    className="note-input"
                    rows="4"
                    placeholder="Enter log entry..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />
                <button className="cyber-btn" onClick={handleSave}>Initialize Save</button>
            </div>

            <div className="notes-list">
                {loading ? (
                    <p>Decrypting records...</p>
                ) : (
                    notes.map(note => (
                        <div key={note.id} style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '15px',
                            marginBottom: '10px',
                            borderLeft: '2px solid var(--dash-secondary)'
                        }}>
                            <p style={{ fontSize: '12px', color: 'var(--dash-text-muted)', marginBottom: '5px' }}>
                                {new Date(note.created_at).toLocaleString()}
                            </p>
                            <p>{note.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotesModule;