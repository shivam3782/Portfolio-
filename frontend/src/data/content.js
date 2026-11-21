import profile from '../../../shared/profile.json';
export const sections = [['about', 'About'], ['projects', 'Projects'], ['skills', 'Skills'], ['education', 'Education'], ['mentoring', 'Leadership'], ['contact', 'Contact']];
export const links = { github: profile.githubUrl, linkedin: profile.linkedinUrl, email: 'mailto:' + profile.email, cv: profile.resumeUrl };
