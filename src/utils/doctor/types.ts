export interface DiagnosticResult {
  issues: number;
  fixes: Array<() => void>;
}
