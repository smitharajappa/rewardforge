import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Comparison {
  id: string;
  promptIndex: number;
  prompt: string;
  preferred: 'A' | 'B' | 'Tie';
  reasoning: string;
  timestamp: Date;
}

export interface Rating {
  id: string;
  prompt: string;
  helpfulness: number;
  accuracy: number;
  safety: number;
  coherence: number;
  creativity: number;
  overall: number;
  timestamp: Date;
}

export interface RewardModel {
  id: string;
  name: string;
  baseModel: string;
  accuracy: number;
  loss: number;
  epochs: number;
  lossHistory: number[];
  accuracyHistory: number[];
  timestamp: Date;
}

export interface RLRun {
  id: string;
  algorithm: 'PPO' | 'GRPO' | 'DPO';
  rewardModelId: string;
  klPenalty: number;
  rollouts: number;
  maxSteps: number;
  finalReward: number;
  klDivergence: number;
  rewardHistory: { step: number; reward: number }[];
  klHistory: { step: number; kl: number }[];
  lossHistory: { step: number; loss: number }[];
  status: 'completed' | 'running' | 'failed';
  timestamp: Date;
}

export interface ActivityItem {
  id: string;
  type: 'comparison' | 'rating' | 'training' | 'rl_run';
  message: string;
  value?: string;
  valueColor?: string;
  timestamp: Date;
}

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AppContextType {
  comparisons: Comparison[];
  setComparisons: React.Dispatch<React.SetStateAction<Comparison[]>>;
  addComparison: (c: Comparison) => void;
  ratings: Rating[];
  setRatings: React.Dispatch<React.SetStateAction<Rating[]>>;
  addRating: (r: Rating) => void;
  rewardModels: RewardModel[];
  setRewardModels: React.Dispatch<React.SetStateAction<RewardModel[]>>;
  addRewardModel: (rm: RewardModel) => void;
  rlRuns: RLRun[];
  setRlRuns: React.Dispatch<React.SetStateAction<RLRun[]>>;
  addRlRun: (run: RLRun) => void;
  activityLog: ActivityItem[];
  addActivity: (a: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  toasts: Toast[];
  addToast: (t: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  copilotHistory: CopilotMessage[];
  setCopilotHistory: React.Dispatch<React.SetStateAction<CopilotMessage[]>>;
  copilotOpen: boolean;
  setCopilotOpen: (v: boolean) => void;
  activeProject: string;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [rewardModels, setRewardModels] = useState<RewardModel[]>([]);
  const [rlRuns, setRlRuns] = useState<RLRun[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copilotHistory, setCopilotHistory] = useState<CopilotMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm the RewardForge Copilot, an expert in RLHF. I can help you interpret your training runs, pick algorithms, and optimize your pipeline. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addComparison = useCallback((c: Comparison) => {
    setComparisons(prev => [c, ...prev]);
    const item: ActivityItem = {
      id: crypto.randomUUID(),
      type: 'comparison',
      message: `Comparison saved — preferred `,
      value: `Response ${c.preferred}`,
      valueColor: c.preferred === 'A' ? '#38bdf8' : c.preferred === 'B' ? '#f472b6' : '#a3a3a3',
      timestamp: new Date(),
    };
    setActivityLog(prev => [item, ...prev].slice(0, 50));
  }, []);

  const addRating = useCallback((r: Rating) => {
    setRatings(prev => [r, ...prev]);
    const item: ActivityItem = {
      id: crypto.randomUUID(),
      type: 'rating',
      message: `Rating submitted — score `,
      value: `${r.overall.toFixed(1)}/10`,
      valueColor: r.overall >= 8 ? '#34d399' : r.overall >= 5 ? '#38bdf8' : '#f472b6',
      timestamp: new Date(),
    };
    setActivityLog(prev => [item, ...prev].slice(0, 50));
  }, []);

  const addRewardModel = useCallback((rm: RewardModel) => {
    setRewardModels(prev => [rm, ...prev]);
    const item: ActivityItem = {
      id: crypto.randomUUID(),
      type: 'training',
      message: `Model trained — `,
      value: `${rm.name} · ${(rm.accuracy * 100).toFixed(1)}% acc`,
      valueColor: '#34d399',
      timestamp: new Date(),
    };
    setActivityLog(prev => [item, ...prev].slice(0, 50));
  }, []);

  const addRlRun = useCallback((run: RLRun) => {
    setRlRuns(prev => [run, ...prev]);
    const item: ActivityItem = {
      id: crypto.randomUUID(),
      type: 'rl_run',
      message: `${run.algorithm} run complete — reward `,
      value: run.finalReward.toFixed(3),
      valueColor: '#a78bfa',
      timestamp: new Date(),
    };
    setActivityLog(prev => [item, ...prev].slice(0, 50));
  }, []);

  const addActivity = useCallback((a: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    setActivityLog(prev => [{
      ...a,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }, ...prev].slice(0, 50));
  }, []);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(x => x.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      comparisons, setComparisons, addComparison,
      ratings, setRatings, addRating,
      rewardModels, setRewardModels, addRewardModel,
      rlRuns, setRlRuns, addRlRun,
      activityLog, addActivity,
      toasts, addToast, removeToast,
      copilotHistory, setCopilotHistory,
      copilotOpen, setCopilotOpen,
      activeProject: 'My RLHF Project',
      isLoading, setIsLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
