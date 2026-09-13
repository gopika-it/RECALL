import React from 'react';
import { LearningProvider, useLearning } from './context/LearningContext';
import { Toast } from './components/Common/Toast';
import { BottomNav } from './components/Navigation/BottomNav';

// Import Screens
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeDashboardScreen } from './screens/HomeDashboardScreen';
import { CaptureScreen } from './screens/CaptureScreen';
import { UploadInputScreen } from './screens/UploadInputScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { ProcessingCompleteScreen } from './screens/ProcessingCompleteScreen';
import { KnowledgeHubScreen } from './screens/KnowledgeHubScreen';
import { KnowledgeCardsScreen } from './screens/KnowledgeCardsScreen';
import { KnowledgeCardDetailScreen } from './screens/KnowledgeCardDetailScreen';
import { KnowledgeGraphScreen } from './screens/KnowledgeGraphScreen';
import { ResourcesScreen } from './screens/ResourcesScreen';
import { ResourceDetailScreen } from './screens/ResourceDetailScreen';
import { AiTutorScreen } from './screens/AiTutorScreen';
import { SmartQuizScreen } from './screens/SmartQuizScreen';
import { QuizTypeSelectionScreen } from './screens/QuizTypeSelectionScreen';
import { QuizSessionScreen } from './screens/QuizSessionScreen';
import { QuizResultScreen } from './screens/QuizResultScreen';
import { MemoryAnalysisScreen } from './screens/MemoryAnalysisScreen';
import { FocusedRevisionScreen } from './screens/FocusedRevisionScreen';
import { RevisionSessionScreen } from './screens/RevisionSessionScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { LearningPreferencesScreen } from './screens/LearningPreferencesScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const ScreenRenderer: React.FC = () => {
  const { currentScreen } = useLearning();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'signup':
        return <SignupScreen />;
      case 'forgot-password':
        return <ForgotPasswordScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'home':
        return <HomeDashboardScreen />;
      case 'capture':
        return <CaptureScreen />;
      case 'upload-input':
        return <UploadInputScreen />;
      case 'processing':
        return <ProcessingScreen />;
      case 'processing-complete':
        return <ProcessingCompleteScreen />;
      case 'knowledge-hub':
        return <KnowledgeHubScreen />;
      case 'knowledge-cards':
        return <KnowledgeCardsScreen />;
      case 'knowledge-card-detail':
        return <KnowledgeCardDetailScreen />;
      case 'knowledge-graph':
        return <KnowledgeGraphScreen />;
      case 'resources':
        return <ResourcesScreen />;
      case 'resource-detail':
        return <ResourceDetailScreen />;
      case 'ai-tutor':
        return <AiTutorScreen />;
      case 'smart-quiz':
        return <SmartQuizScreen />;
      case 'quiz-type-selection':
        return <QuizTypeSelectionScreen />;
      case 'quiz-session':
        return <QuizSessionScreen />;
      case 'quiz-result':
        return <QuizResultScreen />;
      case 'memory-analysis':
        return <MemoryAnalysisScreen />;
      case 'focused-revision':
        return <FocusedRevisionScreen />;
      case 'revision-session':
        return <RevisionSessionScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'learning-preferences':
        return <LearningPreferencesScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeDashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EB] flex justify-center selection:bg-[#ECE7F9] selection:text-[#6C5CE7]">
      {/* Mobile viewport container */}
      <main className="w-full max-w-md bg-[#FAF8F5] min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col font-sans">
        {renderCurrentScreen()}
        <BottomNav />
        <Toast />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <LearningProvider>
      <ScreenRenderer />
    </LearningProvider>
  );
}
