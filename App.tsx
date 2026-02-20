
import React, { useState } from 'react';
import { AppView } from './types';
import { Layout } from './components/Layout';
import { ChatView } from './components/ChatView';
import { LecturesView } from './components/LecturesView';
import { MeasurementView } from './components/MeasurementView';
import { QuizView } from './components/QuizView';
import { GlossaryView } from './components/GlossaryView';
import { GamesView } from './components/GamesView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.CHAT);

  const renderView = () => {
    switch (activeView) {
      case AppView.CHAT:
        return <ChatView />;
      case AppView.LECTURES:
        return <LecturesView />;
      case AppView.MEASUREMENT:
        return <MeasurementView />;
      case AppView.QUIZ:
        return <QuizView />;
      case AppView.GLOSSARY:
        return <GlossaryView />;
      case AppView.GAMES:
        return <GamesView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
