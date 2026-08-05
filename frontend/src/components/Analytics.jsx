import useAnalytics from "@/hooks/useAnalytics";

/**
 * Thin wrapper around useAnalytics — mount once inside the app tree so
 * GA4 is consent-gated site-wide. Renders nothing.
 */
const Analytics = () => {
  useAnalytics();
  return null;
};

export default Analytics;
