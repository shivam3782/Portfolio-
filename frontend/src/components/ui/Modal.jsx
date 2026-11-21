import { useEffect, useRef } from "react";
import { trapFocus } from "../../lib/focus";
/** Native modal: focus trap, Escape, inert background and restored trigger focus. */
export default function Modal({ title, onClose, children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    dialog.querySelector("input, button")?.focus();
    return () => {
      dialog.close();
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onKeyDown={trapFocus}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="modal-inner">
        <div className="window-bar">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label={`Close ${title}`}>
            Esc ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
