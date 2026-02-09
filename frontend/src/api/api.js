// API client for portfolio website
const envApiBase = import.meta.env.VITE_API_BASE_URL;
const isLocalHost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

// Fallback ensures GitHub Pages builds still work even if Actions variable is missing.
const fallbackApiBase = isLocalHost
    ? '/api'
    : 'https://new-portfolio-v9wh.onrender.com/api';

const rawApiBase = envApiBase || fallbackApiBase;
const API_BASE = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

export function apiUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${normalizedPath}`;
}

async function parseJsonResponse(response) {
    const text = await response.text();

    try {
        return text ? JSON.parse(text) : {};
    } catch {
        throw new Error('Invalid API response from server');
    }
}

export async function fetchProjects() {
    const response = await fetch(apiUrl('/projects'));
    const data = await parseJsonResponse(response);

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch projects');
    }

    return data.data;
}

export async function fetchExperience() {
    const response = await fetch(apiUrl('/experience'));
    const data = await parseJsonResponse(response);

    if (!response.ok || !data.success) {
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

    const data = await parseJsonResponse(response);

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

    const data = await parseJsonResponse(response);

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid session');
    }

    return data;
}