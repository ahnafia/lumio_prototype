/** What every question screen reports to the player, so Check can be wired generically. */
export interface AnswerStatus {
  hasAnswer: boolean;
  isCorrect: boolean;
}

export const NO_ANSWER: AnswerStatus = { hasAnswer: false, isCorrect: false };

export interface QuestionProps<S> {
  screen: S;
  /** True once checked: inputs lock while the feedback sheet is open. */
  locked: boolean;
  /** True after Check: show which answer was right. */
  revealed: boolean;
  onChange: (status: AnswerStatus) => void;
}
