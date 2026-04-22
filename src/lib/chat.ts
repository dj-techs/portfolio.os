/**
 * Typed stub for the AI portfolio assistant.
 *
 * Phase 6 (this iteration): returns a canned "coming soon" string so both
 * shells render useful placeholders.
 *
 * Phase 6.5 (deferred — see FUTURE.md): swap the implementation to stream
 * from an Anthropic Edge route. The exported signature MUST NOT change.
 */

export type ChatReply = {
  content: string;
  comingSoon: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function askClaude(prompt: string): Promise<ChatReply> {
  return {
    content:
      "[coming soon] The AI portfolio assistant is under construction. In the meantime, try `resume`, `projects`, or `skills`.",
    comingSoon: true,
  };
}
