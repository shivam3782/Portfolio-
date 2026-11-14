import { useState } from 'react';
import { safeUrl } from '../../lib/api';
import ProjectIllustration from '../ProjectIllustration';

export default function ProjectMedia({ url, name, compact = false }) {
  const image = safeUrl(url);
  const [status, setStatus] = useState(image ? 'loading' : url?.trim() ? 'invalid' : 'empty');
  return <div className={compact ? 'admin-thumbnail' : 'editor-preview'}>
    {image && status !== 'error' ? <img src={image} alt={name + ' preview'} onLoad={() => setStatus('ready')} onError={() => setStatus('error')} loading={compact ? 'lazy' : 'eager'} referrerPolicy="no-referrer" /> : <ProjectIllustration name={name || 'Your project'} />}
    {!compact && <div className={'preview-feedback' + (status === 'error' || status === 'invalid' ? ' preview-error' : '')} role="status">{status === 'loading' ? 'Loading preview…' : status === 'error' ? 'This image could not be loaded. Check the URL or use concept artwork.' : status === 'invalid' ? 'Enter a complete https:// or http:// image URL.' : status === 'empty' ? 'No image URL. Labeled concept artwork will be shown.' : 'Preview loaded successfully.'}</div>}
  </div>;
}
