'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { LandingView } from '@/components/views/LandingView';
import { LoginView } from '@/components/views/LoginView';
import { SignupView } from '@/components/views/SignupView';
import { OnboardingView } from '@/components/views/OnboardingView';
import { DashboardView } from '@/components/views/DashboardView';
import { LessonView } from '@/components/views/LessonView';
import { ChatView } from '@/components/views/ChatView';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

export default function Home() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'login':
        return <LoginView />;
      case 'signup':
        return <SignupView />;
      case 'onboarding':
        return <OnboardingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'lesson':
        return <LessonView />;
      case 'chat':
        return <ChatView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {renderView()}
      </motion.div>
    </AnimatePresence>
  );
}
