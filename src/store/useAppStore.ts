import { create } from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
  userType: string;
  organization?: string | null;
  ageGroup?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  language?: string | null;
  educationLevel?: string | null;
  onboardingComplete: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  lessonId?: string | null;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface CurriculumItem {
  id: string;
  userId: string;
  title: string;
  subject: string;
  description?: string | null;
  modules: string;
  status: string;
  progress: number;
  lessons?: LessonItem[];
}

export interface LessonItem {
  id: string;
  curriculumId: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  contentVernacular: string;
  contentEnglish?: string | null;
  references?: string | null;
  slangNotes?: string | null;
  keyTakeaways?: string | null;
  status: string;
}

export type AppView = 'landing' | 'login' | 'signup' | 'onboarding' | 'dashboard' | 'lesson' | 'chat';

interface OnboardingData {
  userType: string;
  organization?: string;
  ageGroup?: string;
  city?: string;
  state?: string;
  country?: string;
  language?: string;
  educationLevel?: string;
  subjects: string[];
}

interface AppState {
  currentView: AppView;
  user: UserProfile | null;
  onboardingStep: number;
  onboardingData: OnboardingData;
  selectedCurriculum: CurriculumItem | null;
  selectedLesson: LessonItem | null;
  chatMessages: ChatMessage[];
  isLoading: boolean;

  setView: (view: AppView) => void;
  setUser: (user: UserProfile | null) => void;
  setOnboardingStep: (step: number) => void;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  selectCurriculum: (curriculum: CurriculumItem | null) => void;
  selectLesson: (lesson: LessonItem | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
}

const defaultOnboardingData: OnboardingData = {
  userType: 'individual',
  organization: '',
  ageGroup: '',
  city: '',
  state: '',
  country: '',
  language: '',
  educationLevel: '',
  subjects: [],
};

export const useAppStore = create<AppState>((set) => ({
  currentView: 'landing',
  user: null,
  onboardingStep: 0,
  onboardingData: defaultOnboardingData,
  selectedCurriculum: null,
  selectedLesson: null,
  chatMessages: [],
  isLoading: false,

  setView: (view) => set({ currentView: view }),

  setUser: (user) => set({ user }),

  setOnboardingStep: (step) => set({ onboardingStep: step }),

  setOnboardingData: (data) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, ...data },
    })),

  completeOnboarding: () => {
    set((state) => ({
      onboardingStep: 5,
      user: state.user
        ? { ...state.user, onboardingComplete: true }
        : null,
    }));
  },

  resetOnboarding: () =>
    set({
      onboardingStep: 0,
      onboardingData: defaultOnboardingData,
    }),

  selectCurriculum: (curriculum) =>
    set({ selectedCurriculum: curriculum }),

  selectLesson: (lesson) => set({ selectedLesson: lesson }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  setChatMessages: (messages) => set({ chatMessages: messages }),

  clearChat: () => set({ chatMessages: [] }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
