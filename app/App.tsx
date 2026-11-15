import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useCourse } from './course';
import { Button, Card, ProgressBar } from './design/components';
import { RichText } from './design/RichText';
import { ErrorBoundary } from './shell/ErrorBoundary';
import { Message } from './shell/Message';
import { TopBar } from './shell/TopBar';

function Home() {
  const { course, isExample } = useCourse();
  return (
    <>
      <TopBar xp={0} streak={0} />
      <main className="column" style={{ paddingTop: 'var(--s-6)' }}>
        <h1>{course.title}</h1>
        {isExample && <p style={{ color: 'var(--c-muted)' }}>Example course</p>}
        <p style={{ marginTop: 'var(--s-4)' }}>The path lands in #4.</p>
        {/* Temporary design-system sample, replaced by the path in #4. */}
        <Card style={{ marginTop: 'var(--s-6)', display: 'grid', gap: 'var(--s-4)' }}>
          <RichText text={'The **tangent line** at $x = a$ has slope $f\'(a)$.\n\n$$f\'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$$\n\nFor $y = x^2$ that is **$2a$**.'} />
          <ProgressBar value={0.4} label="Sample progress" />
          <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>
      </main>
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
  return (
    <>
      <TopBar xp={0} streak={0} />
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
