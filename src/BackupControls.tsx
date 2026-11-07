import { useRef, useState, type ChangeEvent } from "react";
import { Download, Upload } from "lucide-react";
import { catalog } from "./catalog";
import { Confirm } from "./components";
import { decode, type AppState } from "./model";
import { useStore } from "./store";

// Backups are intentionally local: no account, API, network transfer or
// storage of uploaded files. The existing validated workspace format is used.
export function BackupControls() {
  const { state, restore } = useStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<AppState | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function download() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `grantly-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setError("");
    setSuccess("Backup downloaded to your device.");
  }

  async function readBackup(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    setError("");
    setSuccess("");
    if (file.size > 100_000) {
      setError("This backup is too large. Choose a GRANTLY JSON backup under 100 KB.");
      return;
    }
    try {
      const restored = decode(await file.text(), catalog.map((s) => s.id));
      setPending(restored);
    } catch {
      setError("This file is not a valid GRANTLY workspace backup. Your current data is unchanged.");
    }
  }

  return (
    <div className="backup-controls">
      <h3>Your workspace backup</h3>
      <p>Save your progress as JSON, or restore a previous backup on this browser. Files include your profile, notes and application tracking; keep them private.</p>
      <div className="backup-buttons">
        <button type="button" className="button secondary" onClick={download}>
          <Download size={16} /> Export backup
        </button>
        <button type="button" className="button secondary" onClick={() => fileInput.current?.click()}>
          <Upload size={16} /> Import backup
        </button>
        <input ref={fileInput} className="sr-only" type="file" accept=".json,application/json" aria-label="Choose a GRANTLY workspace backup" onChange={readBackup} />
      </div>
      {error && <p role="alert" className="field-error">{error}</p>}
      {success && <p role="status" className="success-message">{success}</p>}
      <Confirm
        open={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          restore(pending);
          // A restore updates the shared profile; reload only the form state
          // through its keyed parent, not the whole browser.
          setPending(null);
          setSuccess("Backup restored. Your workspace has been updated.");
        }}
        title="Replace this workspace with your backup?"
        confirmLabel="Restore backup"
        cancelLabel="Keep current workspace"
      >
        This will replace your current profile and progress with {pending ? Object.keys(pending.tracked).length : 0} tracked opportunities from the backup, including notes and document readiness. Export your current workspace first if you want to keep a copy.
      </Confirm>
    </div>
  );
}
