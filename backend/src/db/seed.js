import database from './database.js';

// Sample projects data
const projects = [
    {
        title: 'NoteWorks',
        description: 'A full-stack note-taking application with authentication, real-time-friendly APIs, and clean UX for organizing personal and academic notes.',
        techStack: 'Vue, JavaScript, Node.js, NoSQL, REST APIs, Cloud Services',
        link: 'https://github.com/acaptainb/noteworks',
        displayOrder: 1
    },
    {
        title: 'Encrypted Chat Application',
        description: 'End-to-end encrypted messaging app with secure key exchange. Implements AES-256 encryption and RSA key pairs for secure communication.',
        techStack: 'Node.js, React, WebSocket, Crypto',
        link: 'https://github.com/username/encrypted-chat',
        displayOrder: 2
    },
    {
        title: 'CTF Challenge Platform',
        description: 'A capture-the-flag platform for hosting cybersecurity challenges. Includes categories for web exploitation, cryptography, reverse engineering, and forensics.',
        techStack: 'Django, PostgreSQL, Docker, Redis',
        link: 'https://github.com/username/ctf-platform',
        displayOrder: 3
    },
    {
        title: 'Password Manager CLI',
        description: 'Command-line password manager with secure vault storage. Uses Argon2 for key derivation and AES-GCM for encryption.',
        techStack: 'Rust, SQLCipher, Argon2',
        link: 'https://github.com/username/pass-vault',
        displayOrder: 4
    }
];

// Sample experience data
const experience = [
    {
        title: 'Congressional App Challenge Winner (ID-01)',
        description: 'Recognized in the Congressional App Challenge for ID-01 with a project focused on practical impact and technical execution.',
        category: 'award',
        date: '2024',
        displayOrder: 1
    },
    {
        title: 'National Cyber League - Top 10%',
        description: 'Competed in individual and team competitions covering cryptography, log analysis, network traffic analysis, and web exploitation.',
        category: 'competition',
        date: '2025',
        displayOrder: 2
    },
    {
        title: 'Cybersecurity Club - Vice President',
        description: 'Lead weekly workshops on penetration testing, CTF competitions, and security best practices. Grew membership by 150%.',
        category: 'club',
        date: '2024 - Present',
        displayOrder: 3
    },
    {
        title: 'HackTheBox University CTF - 15th Place',
        description: 'Collaborated with team of 5 to compete against 800+ university teams worldwide in 48-hour cybersecurity competition.',
        category: 'competition',
        date: '2024',
        displayOrder: 4
    },
    {
        title: 'CompTIA Security+ Certified',
        description: 'Industry-recognized certification validating core security skills and knowledge across network security, compliance, and operations.',
        category: 'award',
        date: '2024',
        displayOrder: 5
    },
    {
        title: 'ACM Programming Club',
        description: 'Active member participating in competitive programming contests and algorithm study sessions.',
        category: 'club',
        date: '2023 - Present',
        displayOrder: 6
    }
];

// Seed the database
async function seed() {
    // Wait for database to be ready
    await database.ready();

    if (database.hasData()) {
        console.log('Database already has data, skipping seed.');
        return;
    }

    console.log('Seeding database...');

    for (const project of projects) {
        database.createProject(
            project.title,
            project.description,
            project.techStack,
            project.link,
            project.displayOrder
        );
    }
    console.log(`Inserted ${projects.length} projects`);

    for (const exp of experience) {
        database.createExperience(
            exp.title,
            exp.description,
            exp.category,
            exp.date,
            exp.displayOrder
        );
    }
    console.log(`Inserted ${experience.length} experience items`);

    console.log('Seeding complete!');
}

seed();