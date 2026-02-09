// API client for portfolio website
const rawApiBase = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

export function apiUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${normalizedPath}`;
}

export async function fetchProjects() {
    const response = await fetch(apiUrl('/projects'));
    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch projects');
    }

    return data.data;
}

export async function fetchExperience() {
    const response = await fetch(apiUrl('/experience'));
    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch experience');
    }

    return data.data;
}

export async function submitContact(formData) {
    const response = await fetch(apiUrl('/contact'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
    }

    return data;
}

export async function unlockSecret(formData) {
    const response = await fetch(apiUrl('/unlock'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid session');
    }

    return data;
}