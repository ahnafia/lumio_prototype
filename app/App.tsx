import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { PathHome } from './path/PathHome';
import { LessonRoute } from './player/LessonPlayer';
import { useProgress } from './progress/useProgress';
import { ErrorBoundary } from './shell/ErrorBoundary';
import { Message } from './shell/Message';
import { SettingsMenu } from './shell/SettingsMenu';
import { TopBar } from './shell/TopBar';

function Home() {
  const progress = useProgress();
  return (
    <>
      <TopBar xp={progress.xp} streak={progress.streak}>
        <SettingsMenu />
      </TopBar>
      <PathHome progress={progress} />
    </>
  );
}

function NotFound() {
  const navigate = useNavigate();
  const progress = useProgress();
  return (
    <>
      <TopBar xp={progress.xp} streak={progress.streak} />
      <main className="column">
        <Message
          icon="target"
          title="Nothing here"
          body="That page doesn't exist. Head back to the path and pick up where you left off."
          action={{ label: 'Back to the path', onClick: () => navigate('/') }}
        />
      </main>
    </>
  );
}

export function App() {
  return (
    <HashRouter>
      <div className="app">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson/:id" element={<LessonRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </HashRouter>
  );
}
