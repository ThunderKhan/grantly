import { decisionOutcomes, type DecisionOutcome, type Scholarship } from "./model";
import { useStore } from "./store";

// A local record only. No action here submits an application to a provider.
export function DecisionFields({ s }: { s: Scholarship }) {
  const { state, setDecision } = useStore();
  const record = state.tracked[s.id];
  if (record?.stage !== "decision_received") return null;
  return (
    <fieldset className="decision-fields">
      <legend>Record your decision</legend>
      <label>
        Outcome
        <select
          aria-label={`Decision outcome for ${s.title}`}
          value={record.outcome ?? ""}
          onChange={(event) => setDecision(s.id, event.target.value as DecisionOutcome | "", record.decisionDate ?? "")}
        >
          <option value="">Not recorded</option>
          {Object.entries(decisionOutcomes).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label>
        Decision date (optional)
        <input
          type="date"
          aria-label={`Decision date for ${s.title}`}
          value={record.decisionDate ?? ""}
          onChange={(event) => setDecision(s.id, record.outcome ?? "", event.target.value)}
        />
      </label>
      <small>Recorded by you. GRANTLY does not receive decisions from providers.</small>
    </fieldset>
  );
}
