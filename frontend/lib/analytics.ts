declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
  console.log(`[Analytics Track] Action: ${action} | Category: ${category} | Label: ${label || ''}`);
};
