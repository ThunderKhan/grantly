import { useRef, useState, type FormEvent } from "react";
// avoid-ai-design-ignore: I3 -- Check identifies save confirmation and concrete matching/privacy facts.
import { Check, ShieldCheck, UserRound, Trash2 } from "lucide-react";
import { useStore } from "./store";
import {
  fields,
  incomeBands,
  levels,
  regions,
  emptyProfile,
  validMarks,
  type Profile as ProfileType,
} from "./model";
import { Confirm, SectionTitle } from "./components";
import { Link } from "react-router-dom";
export function Profile() {
  const { state, saveProfile, reset } = useStore();
  const [form, setForm] = useState<ProfileType>(state.profile);
  const marksRef = useRef<HTMLInputElement>(null);
  const [marksError, setMarksError] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const count = ["level", "field", "region", "marks", "income"].filter(
    (k) => form[k as keyof ProfileType],
  ).length;
  const dirty = JSON.stringify(form) !== JSON.stringify(state.profile);
  function validateMarks(value: string) {
    return !validMarks(value)
      ? "Enter a percentage from 0 to 100, or leave this blank."
      : "";
  }
  function update(key: keyof ProfileType, value: string) {
    setSaved(false);
    if (key === "marks" && marksError) setMarksError(validateMarks(value));
    setForm((v) => ({ ...v, [key]: value }));
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    const error = validateMarks(form.marks);
    setMarksError(error);
    if (error) {
      marksRef.current?.focus();
      return;
    }
    saveProfile({ ...form, name: form.name.trim() });
    setSaved(true);
  }
  return (
    <>
      <SectionTitle
        title="Student profile"
        description="Tell us a little about your studies. We’ll explain how each opportunity fits."
      />
      <div className="profile-layout">
        <form noValidate onSubmit={submit} className="panel profile-form">
          <div className="form-heading">
            <span className="profile-avatar">
              <UserRound size={25} />
            </span>
            <div>
              <h2>Your student profile</h2>
              <p>Every field is optional. Unknown is a valid answer.</p>
            </div>
          </div>
          <label>
            Preferred name <span className="muted">(optional)</span>
            <input
              value={form.name}
              maxLength={60}
              onChange={(e) => update("name", e.target.value)}
              placeholder="What should we call you?"
              autoComplete="given-name"
            />
          </label>
          <div className="form-grid">
            {(
              [
                ["level", "Education level", levels],
                ["field", "Field of study", fields],
                ["region", "State of residence", regions],
                ["income", "Household income band", incomeBands],
              ] as const
            ).map(([key, label, options]) => (
              <label key={key}>
                {label}
                <select
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                >
                  <option value="">Unknown / prefer not to say</option>
                  {options.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            ))}
            <label>
              Latest academic result (%)
              <input
                ref={marksRef}
                aria-invalid={Boolean(marksError)}
                aria-describedby={
                  marksError ? "marks-error marks-hint" : "marks-hint"
                }
                onBlur={() => setMarksError(validateMarks(form.marks))}
                type="number"
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                value={form.marks}
                onChange={(e) => update("marks", e.target.value)}
                placeholder="Leave blank if unknown"
              />
              {marksError && (
                <span className="field-error" id="marks-error" role="alert">
                  {marksError}
                </span>
              )}
              <small id="marks-hint">
                Use a percentage only. Don’t enter an unconverted GPA.
              </small>
            </label>
          </div>
          {dirty && (
            <p className="unsaved-note">Your changes haven’t been saved yet.</p>
          )}
          <div className="form-footer">
            <button className="button" type="submit">
              <Check size={17} /> Save profile
            </button>
            <button
              className="reset-text"
              type="button"
              onClick={() => {
                setForm({ ...emptyProfile });
                setSaved(false);
                setMarksError("");
              }}
            >
              Clear form
            </button>
          </div>
          {saved && (
            <div className="success-message" role="status">
              <Check size={18} /> Profile saved. Matching has been updated.{" "}
              <Link to="/discover">Explore your opportunities</Link>
            </div>
          )}
        </form>
        <aside className="profile-aside">
          <div className="mint-panel">
            <h2>
              More clarity.
              <br />
              No false certainty.
            </h2>
            <p>
              <strong>{count} of 5</strong> matching fields filled
            </p>
            <div className="segmented-progress" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < count ? "filled" : ""} />
              ))}
            </div>
            <p>
              We compare your answers with each requirement. Missing information
              is always marked “Needs verification”.
            </p>
            <ul className="plain-list">
              <li>
                <Check size={16} /> No invented match percentages
              </li>
              <li>
                <Check size={16} /> Explore with an incomplete profile
              </li>
              <li>
                <Check size={16} /> Change your answers anytime
              </li>
            </ul>
          </div>
          <div className="privacy-note">
            <ShieldCheck size={22} />
            <div>
              <h3>On this browser. In your control.</h3>
              <p>
                No account, cloud sync, or document uploads. Use sample details
                on a shared device. Income is optional and stored locally with
                your profile.
              </p>
              <button
                onClick={() => setConfirm(true)}
                className="reset-text danger"
              >
                <Trash2 size={14} /> Reset entire workspace
              </button>
            </div>
          </div>
        </aside>
      </div>
      <Confirm
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          reset();
          setForm({ ...emptyProfile });
          setSaved(false);
        }}
        title="Reset your local workspace?"
        confirmLabel="Reset workspace"
        cancelLabel="Keep workspace"
      >
        This clears your profile, all saved opportunities, notes, and document
        readiness in this browser. This cannot be undone.
      </Confirm>
    </>
  );
}
