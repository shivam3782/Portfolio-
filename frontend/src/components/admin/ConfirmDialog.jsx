import { useEffect, useId, useRef } from "react";

export default function ConfirmDialog({
  title,
  children,
  confirm = "Confirm",
  cancel = "Cancel",
  onConfirm,
  onCancel,
  busy = false,
  danger = false,
  error,
  allowConfirm = true,
}) {
  const ref = useRef(null);
  const id = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="admin-confirm"
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(event) => {
        if (event.target === ref.current && !busy) onCancel();
      }}
    >
      <div
        className={"confirm-symbol" + (danger ? " is-danger" : "")}
        aria-hidden="true"
      >
        {danger ? "!" : "↗"}
      </div>
      <h2 id={id}>{title}</h2>
      <div className="confirm-description">{children}</div>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <button
          autoFocus
          className="button secondary"
          onClick={onCancel}
          disabled={busy}
        >
          {cancel}
        </button>
        {allowConfirm && (
          <button
            className={"button " + (danger ? "danger-solid" : "primary")}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working…" : confirm}
          </button>
        )}
      </div>
    </dialog>
  );
}
