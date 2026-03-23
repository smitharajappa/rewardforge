import { useNavigate } from 'react-router-dom';

export function BlogBackLink() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/blog')}
      className="flex items-center gap-1.5 font-mono transition-all"
      style={{ color: '#525252', fontSize: '13px' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
    >
      ← Blog
    </button>
  );
}
