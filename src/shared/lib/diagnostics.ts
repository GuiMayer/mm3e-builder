/** Pure diagnostics retain fallbacks for non-UI consumers. Names are catalog identities. */
export interface DiagnosticName {
  kind: 'effect' | 'modifier' | 'skill' | 'advantage' | 'field';
  id: string;
  effectId?: string;
}
export interface RuleDiagnostic {
  message: string;
  messageKey?: string;
  params?: Record<string, string | number>;
  names?: Record<string, DiagnosticName>;
}
