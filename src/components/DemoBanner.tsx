import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function DemoBanner() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const check = () => setActive(localStorage.getItem('rf_demo_mode') === 'marcus');
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  if (!active) return null;

  const exitDemo = () => {
    localStorage.removeItem('rf_demo_mode');
    localStorage.removeItem('rf_comparisons');
    localStorage.removeItem('rf_ratings');
    localStorage.removeItem('rf_models');
    localStorage.removeItem('rf_runs');
    localStorage.removeItem('rf_activity');
    setActive(false);
    navigate('/');
  };

  return (
    <div
      className="flex items-center justify-between px-6"
      style={{
        background: 'rgba(56,189,248,0.06)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        padding: '10px 24px',
        minHeight: 38,
        flexShrink: 0,
      }}
    >
      <span className="font-mono text-[13px]" style={{ color: '#38bdf8' }}>
        👤 Demo: Marcus's Legal AI Project · LexAI
      </span>
      <button
        onClick={exitDemo}
        className="font-mono text-[12px] transition-colors"
        style={{ color: '#525252' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
      >
        Exit demo ×
      </button>
    </div>
  );
}
