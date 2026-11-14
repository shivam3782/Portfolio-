import { useSyncExternalStore } from 'react';

const query = window.matchMedia('(max-width: 700px)');
const subscribe = listener => {
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
};

export default function useCompactLayout() {
  return useSyncExternalStore(subscribe, () => query.matches, () => false);
}
