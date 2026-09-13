import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenType,
  Concept,
  Resource,
  UserProfile,
  UserPreferences,
  Achievement,
  AppNotification,
  SavedNote,
  ChatMessage,
  QuizQuestion,
  QuizResultSummary,
} from '../types';
import {
  initialConcepts,
  initialResources,
  initialProfile,
  initialPreferences,
  initialAchievements,
  initialNotifications,
  initialSavedNotes,
  initialChatMessages,
  initialQuizQuestions,
} from '../data/mockData';

interface LearningContextType {
  currentScreen: ScreenType;
  selectedConceptId: string;
  selectedResourceId: string;
  concepts: Concept[];
  resources: Resource[];
  profile: UserProfile;
  preferences: UserPreferences;
  achievements: Achievement[];
  notifications: AppNotification[];
  savedNotes: SavedNote[];
  chatMessages: ChatMessage[];
  quizQuestions: QuizQuestion[];
  lastQuizResult: QuizResultSummary | null;
  toast: string | null;
  deviceMode: 'mobile' | 'responsive';
  setDeviceMode: (mode: 'mobile' | 'responsive') => void;
  navigateTo: (screen: ScreenType, params?: { conceptId?: string; resourceId?: string }) => void;
  goBack: () => void;
  markConceptRemember: (conceptId: string) => void;
  markConceptUnsure: (conceptId: string) => void;
  updateConceptMastery: (conceptId: string, value: number) => void;
  addChatMessage: (text: string, conceptId?: string) => void;
  saveChatMessageToKnowledge: (messageId: string) => void;
  addSavedNote: (note: Omit<SavedNote, 'id' | 'date'>) => void;
  recordQuizFinish: (score: number, total: number) => QuizResultSummary;
  markNotificationRead: (id: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  showToast: (msg: string) => void;
  logout: () => void;
  getSelectedConcept: () => Concept;
  getSelectedResource: () => Resource;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [history, setHistory] = useState<ScreenType[]>(['splash']);
  const [selectedConceptId, setSelectedConceptId] = useState<string>('c-deadlock');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('res-os-unit3');
  
  const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(initialSavedNotes);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [quizQuestions] = useState<QuizQuestion[]>(initialQuizQuestions);
  const [lastQuizResult, setLastQuizResult] = useState<QuizResultSummary | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'responsive'>('mobile');

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const navigateTo = (screen: ScreenType, params?: { conceptId?: string; resourceId?: string }) => {
    if (params?.conceptId) {
      setSelectedConceptId(params.conceptId);
    }
    if (params?.resourceId) {
      setSelectedResourceId(params.resourceId);
    }
    setHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    // Auto scroll top when screen changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // remove current
      const previous = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentScreen(previous);
    } else {
      navigateTo('home');
    }
  };

  const updateConceptMastery = (conceptId: string, value: number) => {
    const clamped = Math.min(100, Math.max(0, value));
    setConcepts((prev) =>
      prev.map((c) => {
        if (c.id === conceptId) {
          const status = clamped >= 75 ? 'strong' : clamped < 40 ? 'forgetting_soon' : 'needs_practice';
          return { ...c, mastery: clamped, status, lastReviewed: 'Just now' };
        }
        return c;
      })
    );
  };

  const markConceptRemember = (conceptId: string) => {
    setConcepts((prev) =>
      prev.map((c) => {
        if (c.id === conceptId) {
          const nextMastery = Math.min(100, c.mastery + 14);
          const status = nextMastery >= 75 ? 'strong' : 'needs_practice';
          return { ...c, mastery: nextMastery, status, lastReviewed: 'Just now' };
        }
        return c;
      })
    );
    showToast('Marked as remembered! Mastery increased.');
  };

  const markConceptUnsure = (conceptId: string) => {
    setConcepts((prev) =>
      prev.map((c) => {
        if (c.id === conceptId) {
          const nextMastery = Math.max(20, c.mastery - 8);
          return { ...c, mastery: nextMastery, status: 'needs_practice', lastReviewed: 'Just now' };
        }
        return c;
      })
    );
    showToast('Saved to Weak Concepts for targeted revision.');
  };

  const addChatMessage = (text: string, conceptId?: string) => {
    const activeConcept = concepts.find((c) => c.id === (conceptId || selectedConceptId)) || concepts[0];
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
      conceptId: activeConcept.id,
      conceptTitle: activeConcept.title,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Generate intelligent AI response contextually
    setTimeout(() => {
      let aiText = '';
      const lower = text.toLowerCase();

      if (lower.includes('deadlock') && lower.includes('what')) {
        aiText =
          'Deadlock occurs when two or more processes are blocked indefinitely because each is holding a resource and waiting for another resource held by another process in the set.\n\nKey conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.';
      } else if (lower.includes('hold and wait') || (lower.includes('example') && lower.includes('hold'))) {
        aiText =
          'Imagine two students working on a chemistry experiment:\n\n• Student 1 holds the only test tube and waits for the dropper.\n• Student 2 holds the dropper and waits for the test tube.\n\nNeither puts down what they hold until they get the second tool. In operating systems, this is the "Hold and Wait" condition that fuels deadlocks.';
      } else if (lower.includes('starvation') || lower.includes('difference')) {
        aiText =
          'Key Distinction:\n\n1. Deadlock is a permanent freeze: No process in the set can ever proceed without external preemption or termination.\n\n2. Starvation is indefinite delay: The CPU continues executing, but a low-priority process is repeatedly bypassed in favor of higher priority requests. It can recover naturally if queue load drops.';
      } else if (lower.includes('banker') || lower.includes('safe')) {
        aiText =
          "Banker's Algorithm tests for safety by simulating the allocation of predetermined maximum potential resource needs. If a sequence of processes exists where everyone can finish safely without deadlock, the state is deemed Safe.";
      } else if (lower.includes('circular wait')) {
        aiText =
          'Circular Wait means a closed loop of dependencies: P0 waits for P1, P1 waits for P2, and Pn waits for P0. To prevent it, the OS enforces a global linear order on all resources, requiring processes to request them strictly in ascending sequence.';
      } else if (lower.includes('why') || lower.includes('important')) {
        aiText =
          'Understanding this is crucial because modern concurrent systems—from database transaction engines to cloud hypervisors—must either prevent or detect these stalls to ensure uninterrupted reliability.';
      } else if (lower.includes('quiz')) {
        aiText =
          'Here is a quick question:\n\nIf we enforce that a process must release all held resources before requesting new ones, which Coffman condition do we break?\n\nAnswer: Hold and Wait.';
      } else {
        aiText = `Regarding **${activeConcept.title}** (${activeConcept.topic}):\n\n${activeConcept.summary}\n\nKey takeaway: In ${activeConcept.topic}, this mechanism ensures synchronization and stability across concurrent threads. Would you like a simple real-world analogy or a practice question?`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: aiText,
        timestamp: 'Just now',
        conceptId: activeConcept.id,
        conceptTitle: activeConcept.title,
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 650);
  };

  const saveChatMessageToKnowledge = (messageId: string) => {
    const targetMsg = chatMessages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    setChatMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, savedToKnowledge: true } : m))
    );

    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      title: `${targetMsg.conceptTitle || 'AI Explanation'} Key Takeaway`,
      content: targetMsg.text,
      conceptId: targetMsg.conceptId,
      resourceTitle: 'OS Unit 3.pdf',
      date: 'Today',
    };

    setSavedNotes((prev) => [newNote, ...prev]);
    showToast('Saved to Knowledge Hub!');
  };

  const addSavedNote = (noteData: Omit<SavedNote, 'id' | 'date'>) => {
    const newNote: SavedNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      date: 'Today',
    };
    setSavedNotes((prev) => [newNote, ...prev]);
    showToast('Note added to your Knowledge Hub!');
  };

  const recordQuizFinish = (score: number, total: number): QuizResultSummary => {
    const percentage = Math.round((score / total) * 100);
    const targetConcept = concepts.find((c) => c.id === 'c-deadlock') || concepts[0];
    const oldMastery = targetConcept.mastery;
    // Exactly matches requirement: "Deadlock 38% → 52%"
    const newMastery = score >= 4 ? 52 : Math.max(30, oldMastery + score * 3);

    updateConceptMastery(targetConcept.id, newMastery);

    const summary: QuizResultSummary = {
      score,
      total,
      percentage,
      masteryBefore: oldMastery,
      masteryAfter: newMastery,
      conceptId: targetConcept.id,
      conceptTitle: targetConcept.title,
      whatYouKnow: ['Deadlock basics', 'Mutual Exclusion'],
      needsReview: ['Circular Wait'],
    };

    setLastQuizResult(summary);
    setProfile((prev) => ({
      ...prev,
      quizzesCount: prev.quizzesCount + 1,
      xp: prev.xp + score * 20,
    }));

    return summary;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
    showToast('Preferences saved');
  };

  const logout = () => {
    setHistory(['login']);
    setCurrentScreen('login');
    showToast('Signed out of RECALL');
  };

  const getSelectedConcept = (): Concept => {
    return concepts.find((c) => c.id === selectedConceptId) || concepts[0];
  };

  const getSelectedResource = (): Resource => {
    return resources.find((r) => r.id === selectedResourceId) || resources[0];
  };

  return (
    <LearningContext.Provider
      value={{
        currentScreen,
        selectedConceptId,
        selectedResourceId,
        concepts,
        resources,
        profile,
        preferences,
        achievements,
        notifications,
        savedNotes,
        chatMessages,
        quizQuestions,
        lastQuizResult,
        toast,
        deviceMode,
        setDeviceMode,
        navigateTo,
        goBack,
        markConceptRemember,
        markConceptUnsure,
        updateConceptMastery,
        addChatMessage,
        saveChatMessageToKnowledge,
        addSavedNote,
        recordQuizFinish,
        markNotificationRead,
        updatePreferences,
        showToast,
        logout,
        getSelectedConcept,
        getSelectedResource,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
