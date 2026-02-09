import { useState, useEffect } from 'react';
import { apiUrl } from '../../api/api';

function VaultModule() {
    const [media, setMedia] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadVault();
    }, []);

    const loadVault = async () => {
        setLoading(true);
        const token = sessionStorage.getItem('secretToken');
        try {
            const [mediaRes, filesRes] = await Promise.all([
                fetch(apiUrl('/secret/media'), { headers: { 'x-secret-token': token } }).then(r => r.json()),
                fetch(apiUrl('/secret/files'), { headers: { 'x-secret-token': token } }).then(r => r.json())
            ]);

            if (mediaRes.success) setMedia(mediaRes.data);
            if (filesRes.success) setFiles(filesRes.data);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append(type === 'media' ? 'media' : 'file', file);

        const token = sessionStorage.getItem('secretToken');
        try {
            const res = await fetch(apiUrl(`/secret/${type}`), {
                method: 'POST',
                headers: { 'x-secret-token': token },
                body: formData
            }).then(r => r.json());

            if (res.success) loadVault();
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="module-panel">
            <h2 className="module-title">Secure Storage // File & Media Vault</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '15px', border: '1px dashed var(--dash-border)' }}>
                    <p style={{ fontSize: '12px', marginBottom: '10px' }}>UPLOAD MEDIA (IMAGE)</p>
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'media')} disabled={uploading} />
                </div>
                <div style={{ padding: '15px', border: '1px dashed var(--dash-border)' }}>
                    <p style={{ fontSize: '12px', marginBottom: '10px' }}>UPLOAD FILE (ZIP/OTHER)</p>
                    <input type="file" onChange={(e) => handleUpload(e, 'files')} disabled={uploading} />
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--dash-accent)', marginBottom: '10px' }}>VISUAL MEDIA</h3>
                <div className="vault-grid">
                    {media.map(m => (
                        <div key={m.id} className="media-card">
                            <img src={m.path} alt={m.original_name} />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 style={{ fontSize: '12px', color: 'var(--dash-secondary)', marginBottom: '10px' }}>SYSTEM FILES</h3>
                <div className="files-list">
                    {files.map(f => (
                        <div key={f.id} className="file-item">
                            <span>{f.original_name} ({Math.round(f.size / 1024)} KB)</span>
                            <a href={f.path} download className="cyber-btn" style={{ padding: '5px 10px', fontSize: '10px' }}>Download</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default VaultModule;