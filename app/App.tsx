import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { PathHome } from './path/PathHome';
import { useProgress } from './progress/useProgress';
import { ErrorBoundary } from './shell/ErrorBoundary';
import { Message } from './shell/Message';
import { TopBar } from './shell/TopBar';

function Home() {
  const progress = useProgress();
  return (
    <>
      <TopBar xp={progress.xp} streak={progress.streak} />
      <PathHome progress={progress} />
    </>
  );
}

function LessonRoute() {
  return (
    <main className="column">
      <Message icon="play" title="Lesson player" body="The player lands in #6." />
    </main>
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
