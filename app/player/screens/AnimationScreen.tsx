import type { AnimationScreen as AnimationScreenData } from '@contract/schema';
import { RichText } from '../../design/RichText';
import { AnimationBox } from '../AnimationBox';

interface Props {
  screen: AnimationScreenData;
  engaged: boolean;
  /** Called on the first onInteract or onComplete (unlocks Continue when requireInteraction is set). */
  onEngaged: () => void;
}

export function AnimationScreen({ screen, engaged, onEngaged }: Props) {
  return (
    <div className="screen screen--animation">
      {screen.title && (
        <h1 className="screen__title">
          <RichText inline text={screen.title} />
        </h1>
      )}
      <AnimationBox visual={screen.visual} playing onInteract={onEngaged} onComplete={onEngaged} />
      <RichText className="screen__caption" text={screen.caption} />
      {screen.requireInteraction && !engaged && (
        <p className="screen__hint">Try it: interact with the visual to continue.</p>
      )}
    </div>
  );
}
