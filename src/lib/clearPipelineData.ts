/**
 * Clears all pipeline localStorage keys and resets React state.
 * Call this whenever the user switches use case or starts fresh.
 */
export const PIPELINE_KEYS = [
  'rf_comparisons',
  'rf_ratings',
  'rf_models',
  'rf_runs',
  'rf_generated_prompts',
  'rf_using_example_faq',
  'rf_activity',
  'rf_pipeline_step',
  'rf_banner_team',
  'rf_banner_audit',
  'rf_banner_drift',
  'rf_cert_id',
  'rf_return_path',
  'rf_notifications',
] as const;

export function clearPipelineData() {
  PIPELINE_KEYS.forEach(k => localStorage.removeItem(k));
  // Signal TopBar to reset notifications to defaults
  localStorage.setItem('rf_notifications_reset', String(Date.now()));
}
