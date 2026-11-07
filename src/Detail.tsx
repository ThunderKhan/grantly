import { Link, useParams } from "react-router-dom";
// avoid-ai-design-ignore: I3 -- Check marks the suggested preparation step, alongside its explicit text.
import {
  ArrowLeft,
  Check,
  FileText,
  Info,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { CircularProgress } from "./motion";
import { DecisionFields } from "./DecisionFields";
import { CalendarDownload } from "./CalendarDownload";
import { catalog } from "./catalog";
import { useStore } from "./store";
import { dateLabel, deadlineLabel, nextAction, awardLabel } from "./model";
import { ButtonLink, Empty, FitBreakdown, SaveButton } from "./components";
import { StageSelect } from "./StageSelect";
export function Detail() {
  const { id } = useParams();
  const s = catalog.find((x) => x.id === id);
  const { state, track, document, notes } = useStore();
  if (!s)
    return (
      <Empty
        title="This opportunity isn’t here."
        description="The link may be incomplete or the record may no longer exist."
      >
        <ButtonLink to="/discover">Back to discovery</ButtonLink>
      </Empty>
    );
  const t = state.tracked[s.id];
  const ready = s.documents.filter((d) => t?.documents.includes(d)).length;
  return (
    <>
      <Link to="/discover" className="back-link">
        <ArrowLeft size={16} /> Back to scholarships
      </Link>
      <div className="detail-layout">
        <div className="detail-main">
          <header className="detail-header">
            <div className="row">
              <span className="provider-mark large">{s.mark}</span>
              <span className="sample-chip">
                {s.isSample ? "Illustrative sample opportunity" : "Officially listed scheme · verify current cycle"}
              </span>
            </div>
            <p className="provider">{s.provider}</p>
            <h1>{s.title}</h1>
            <p className="detail-intro">{s.description}</p>
            <div className="detail-meta">
              <span>
                <MapPin size={16} />
                {s.rules
                  .find((r) => r.field === "region")
                  ?.accepts?.join(", ") ?? "Across India"}
              </span>
              <span>
                <CalendarDays size={16} />
                {dateLabel(s.deadline)}
              </span>
            </div>
          </header>
          {!s.isSample && (
            <section className="panel source-panel">
              <h2>Official source</h2>
              <p>Listed by the provider. Reviewed {dateLabel(s.checkedOn)}; availability, dates and eligibility can change. Open the current scheme before making any decision.</p>
              <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-link">Read official scheme details</a>
            </section>
          )}
          <FitBreakdown s={s} />
          <section className="panel" id="documents">
            <div className="row">
              <div>
                <h2>Your document checklist</h2>
              </div>
              {s.documents.length > 0 && <CircularProgress value={ready} max={s.documents.length} />}
            </div>
            <p className="muted">{s.documents.length ? "Check off each document as you prepare it." : "The official portal specifies the current document requirements. Review them there before applying."}</p>
            <div className="checklist">
              {s.documents.map((d) => (
                <label
                  key={d}
                  className={t?.documents.includes(d) ? "complete" : ""}
                >
                  <input
                    type="checkbox"
                    checked={t?.documents.includes(d) ?? false}
                    onChange={() => document(s.id, d)}
                  />
                  <span>{d}</span>
                  <FileText size={17} />
                </label>
              ))}
            </div>
            {s.documents.length > 0 && <small>Checking your first document also saves this opportunity to your applications.</small>}
          </section>
          <section className="panel">
            <h2>How to prepare & apply</h2>
            <ol className="steps">
              {s.steps.map((step, i) => (
                <li key={step}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <div className="inline-info">
              <Info size={18} />
              <p>{s.isSample
                ? "Sample opportunity: a provider application link is not available."
                : "Apply only through the provider’s official portal. GRANTLY cannot submit or verify your application."}</p>
            </div>
            {!s.isSample && s.applicationUrl && (
              <a className="button secondary" href={s.applicationUrl} target="_blank" rel="noopener noreferrer">
                Open official application portal
              </a>
            )}
          </section>
          {t && (
            <section className="panel">
              <h2>Your personal notes</h2>
              <p className="muted">
                Keep a reminder or record a decision. Avoid sensitive personal
                information.
              </p>
              <label className="sr-only" htmlFor="notes">
                Personal notes
              </label>
              <textarea
                id="notes"
                maxLength={2000}
                rows={4}
                value={t.notes}
                onChange={(e) => notes(s.id, e.target.value)}
                placeholder="Questions to check, a draft idea, or a decision…"
              />
              <small>Saved automatically · {t.notes.length}/2000</small>
            </section>
          )}
        </div>
        <aside className="detail-aside">
          <section className="award-panel">
            <h2>{awardLabel(s)}</h2>
            <p>{s.benefit}</p>
            <div className="award-deadline">
              <CalendarDays size={19} />
              <div>
                <strong>{deadlineLabel(s.deadline)}</strong>
                <span>{dateLabel(s.deadline)}{s.isSample ? " · sample date" : " · verify official date"}</span>
              </div>
            </div>
            <SaveButton s={s} />
            {!t ? (
              <button
                className="button secondary"
                onClick={() => track(s.id, "preparing")}
              >
                Start preparing
              </button>
            ) : (
              <StageSelect s={s} />
            )}
            <DecisionFields s={s} />
            <CalendarDownload s={s} />
            <p className="fine-print">
              Update this stage after you complete each step with the provider.
            </p>
          </section>
          <section className="next-step-panel">
            <span className="next-icon">
              <Check size={17} />
            </span>
            <h3>{nextAction(s, state.profile, t)}</h3>
            <Link to="/profile" className="text-link">
              Review profile
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
