import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Confirm } from "./components";
import { useStore } from "./store";

/** An interactive, self-contained example — not an application to a provider. */
export function DemoStart() {
  const { state, loadDemo } = useStore();
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  const hasProgress =
    Object.keys(state.tracked).length > 0 ||
    Object.values(state.profile).some(Boolean);

  function start() {
    loadDemo();
    setConfirm(false);
    navigate("/dashboard");
  }
  return (
    <>
      <button
        type="button"
        className="button secondary demo-start"
        onClick={() => (hasProgress ? setConfirm(true) : start())}
      >
        Try an interactive example
      </button>
      <Confirm
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={start}
        title="Replace your local progress with a sample?"
        confirmLabel="Load sample workspace"
        cancelLabel="Keep my progress"
      >
        This replaces your local profile, saved opportunities, notes, and checklists with a clearly illustrative student workspace. Export your existing data from Profile if you want a backup. No application will be submitted.
      </Confirm>
    </>
  );
}
