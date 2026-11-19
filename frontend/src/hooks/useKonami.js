import { useEffect, useState } from 'react';
export default function useKonami() {
  const [activated, setActivated] = useState(false);
  useEffect(() => {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let position = 0;
    let timeout;
    const onKey = event => {
      if (event.target.closest?.('input, textarea, select, dialog, [contenteditable="true"]')) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      position = key === sequence[position] ? position + 1 : key === sequence[0] ? 1 : 0;
      if (position === sequence.length) {
        position = 0;
        setActivated(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setActivated(false), 2800);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(timeout);
    };
  }, []);
  return activated;
}
