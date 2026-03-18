import { motion, AnimatePresence } from 'framer-motion';
import { useApp, type Toast } from '@/context/AppContext';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 size={14} style={{ color: '#34d399' }} />,
  info: <Info size={14} style={{ color: '#38bdf8' }} />,
  warning: <AlertTriangle size={14} style={{ color: '#f59e0b' }} />,
  error: <XCircle size={14} style={{ color: '#f43f5e' }} />,
};

const borders = {
  success: '#34d399',
  info: '#38bdf8',
  warning: '#f59e0b',
  error: '#f43f5e',
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useApp();
  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex items-center gap-3 px-3 py-3 rounded-lg min-w-[280px] max-w-[360px] relative"
      style={{
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderLeft: `3px solid ${borders[toast.type]}`,
      }}
    >
      {icons[toast.type]}
      <span className="font-syne text-xs text-[#fafafa] flex-1 leading-relaxed">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-[#525252] hover:text-[#a3a3a3] transition-colors ml-1"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}

export function ToastSystem() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence>
        {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
      </AnimatePresence>
    </div>
  );
}
