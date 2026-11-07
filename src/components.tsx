import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
// avoid-ai-design-ignore: I3 -- Check communicates matched eligibility criteria and completed status, always with text.
import {
  Bookmark,
  Check,
  CircleHelp,
  Clock3,
  GraduationCap,
  X,
  AlertCircle,
} from "lucide-react";
import {
  assess,
  dateLabel,
  deadlineLabel,
  daysUntil,
  fit,
  money,
  type Scholarship,
} from "./model";
import { useStore } from "./store";
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Grantly home">
      <span className="logo-mark">
        <GraduationCap size={25} strokeWidth={2} />
      </span>
      grantly<span className="logo-dot">.</span>
    </Link>
  );
}
export function ButtonLink({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link to={to} className={`button ${secondary ? "secondary" : ""}`}>
      {children}
    </Link>
  );
}
export function SectionTitle({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function Empty({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <GraduationCap size={30} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function Confirm({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Confirm removal",
  cancelLabel = "Keep it",
}: {
  confirmLabel?: string;
  cancelLabel?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    if (!open && ref.current?.open) ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      aria-labelledby={titleId}
      className="confirm"
    >
      <button
        className="icon-button close"
        onClick={onClose}
        aria-label="Cancel"
      >
        <X size={20} />
      </button>
      <h2 id={titleId}>{title}</h2>
      <p>{children}</p>
      <div className="actions">
        <button className="button secondary" onClick={onClose} autoFocus>
          {cancelLabel}
        </button>
        <button
          className="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
export function SaveButton({
  s,
  compact = false,
}: {
  s: Scholarship;
  compact?: boolean;
}) {
  const { state, track, remove } = useStore();
  const [confirm, setConfirm] = useState(false);
  const saved = Boolean(state.tracked[s.id]);
  return (
    <>
      <button
        className={
          compact
            ? `icon-button bookmark ${saved ? "selected" : ""}`
            : `button ${saved ? "secondary" : ""}`
        }
        aria-label={`${saved ? "Remove" : "Save"} ${s.title}`}
        aria-pressed={saved}
        onClick={() => (saved ? setConfirm(true) : track(s.id))}
      >
        <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        {!compact && (saved ? "Saved opportunity" : "Save opportunity")}
      </button>
      <Confirm
        open={confirm}
        title="Remove this opportunity?"
        onClose={() => setConfirm(false)}
        onConfirm={() => remove(s.id)}
      >
        This removes {s.title} and its checklist, notes, and stage from this
        browser. You can save it again later.
      </Confirm>
    </>
  );
}
export function Deadline({ s }: { s: Scholarship }) {
  const days = daysUntil(s.deadline);
  return (
    <span
      className={`deadline ${days !== undefined && days < 0 ? "expired" : ""}`}
      title={dateLabel(s.deadline)}
    >
      <Clock3 size={14} />
      {deadlineLabel(s.deadline)}
    </span>
  );
}
export function FitBadge({ s }: { s: Scholarship }) {
  const { state } = useStore();
  const text = fit(s, state.profile);
  const Icon =
    text === "Potential match"
      ? Check
      : text === "Review fit"
        ? AlertCircle
        : CircleHelp;
  return (
    <span
      className={`fit-badge ${text === "Potential match" ? "matched" : text === "Review fit" ? "review" : ""}`}
    >
      <Icon size={14} />
      {text}
    </span>
  );
}
export function ScholarshipCard({ s }: { s: Scholarship }) {
  const { state } = useStore();
  const outcomes = assess(s, state.profile);
  const matched = outcomes.filter((x) => x.status === "match").length;
  return (
    <article className="scholarship-card">
      <div className="card-top">
        <span
          className={`provider-mark tone-${s.category === "Technology" ? "green" : s.category === "Creative arts" ? "pale" : "white"}`}
        >
          {s.mark}
        </span>
        <span className="category">
          {s.category}
          <small>Illustrative sample</small>
        </span>
        <SaveButton s={s} compact />
      </div>
      <Link className="card-title" to={`/scholarships/${s.id}`}>
        <h3>{s.title}</h3>
      </Link>
      <p className="provider">{s.provider}</p>
      <p className="card-description">{s.description}</p>
      <div className="card-value">
        <strong>{money(s.amount)}</strong>
        <span>{s.amount ? "toward your education" : "Learning resources"}</span>
      </div>
      <div className="fit-row">
        <FitBadge s={s} />
        <span>
          {matched} of {outcomes.length} criteria matched
        </span>
      </div>
      <div className="card-bottom">
        <Deadline s={s} />
        <Link
          to={`/scholarships/${s.id}`}
          className="text-link"
          aria-label={`View ${s.title}`}
        >
          View details
        </Link>
      </div>
    </article>
  );
}
export function FitBreakdown({ s }: { s: Scholarship }) {
  const { state } = useStore();
  return (
    <section className="panel">
      <div className="row">
        <div>
          <h2>Why this may fit you</h2>
        </div>
        <FitBadge s={s} />
      </div>
      <p className="muted">
        Based on your profile and this sample’s stated requirements. This is
        guidance, not an official eligibility decision.
      </p>
      <div className="criteria-list">
        {assess(s, state.profile).map((x) => {
          const Icon =
            x.status === "match"
              ? Check
              : x.status === "unknown"
                ? CircleHelp
                : AlertCircle;
          return (
            <div className={`criterion ${x.status}`} key={x.label}>
              <span className="criterion-icon">
                <Icon size={18} />
              </span>
              <div>
                <div className="criterion-title">
                  <strong>{x.label}</strong>
                  <span>
                    {x.status === "match"
                      ? "Matched"
                      : x.status === "unknown"
                        ? "Needs verification"
                        : "Potential mismatch"}
                  </span>
                </div>
                <p>{x.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Link className="text-link" to="/profile">
        Update your matching profile
      </Link>
    </section>
  );
}
