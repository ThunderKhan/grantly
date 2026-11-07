import { useStore } from "./store";
import { stages, type Scholarship, type Stage } from "./model";
export function StageSelect({ s }: { s: Scholarship }) {
  const { state, track } = useStore();
  return (
    <label className="stage-select">
      Application stage
      <select
        aria-label={`Application stage for ${s.title}`}
        value={state.tracked[s.id]?.stage ?? "saved"}
        onChange={(e) => track(s.id, e.target.value as Stage)}
      >
        {Object.entries(stages).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
