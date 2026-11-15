import type { ExplanationScreen as ExplanationScreenData } from '@contract/schema';
import { RichText } from '../../design/RichText';
import { AnimationBox } from '../AnimationBox';

export function ExplanationScreen({ screen }: { screen: ExplanationScreenData }) {
  return (
    <div className="screen screen--explanation">
      <h1 className="screen__title">
        <RichText inline text={screen.title} />
      </h1>
      <RichText className="screen__body" text={screen.body} />
      {screen.visual && <AnimationBox visual={screen.visual} playing />}
    </div>
  );
}
