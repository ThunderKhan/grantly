import { Link, useSearchParams } from "react-router-dom";
import { FileText } from "lucide-react";
import { catalog } from "./catalog";
import { useStore } from "./store";
import {
  dateLabel,
  daysUntil,
  nextAction,
  stages,
  type Scholarship,
  type Stage,
} from "./model";
import {
  ButtonLink,
  Deadline,
  Empty,
  SaveButton,
  SectionTitle,
} from "./components";
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
export function Applications() {
  const { state } = useStore();
  const [params, setParams] = useSearchParams();
  const stage = params.get("stage") ?? "";
  const tracked = catalog.filter((s) => state.tracked[s.id]);
  const results = tracked
    .filter((s) => !stage || state.tracked[s.id].stage === stage)
    .sort(
      (a, b) =>
        (daysUntil(a.deadline) ?? Infinity) -
        (daysUntil(b.deadline) ?? Infinity),
    );
  return (
    <>
      <SectionTitle
        title="My applications"
        description="Keep your shortlist, preparation, and decisions in one place."
      >
        <ButtonLink to="/discover">Find scholarships</ButtonLink>
      </SectionTitle>
      <div className="stage-tabs" aria-label="Filter application stage">
        {[["", "All applications"], ...Object.entries(stages)].map(
          ([key, label]) => (
            <button
              key={key}
              className={stage === key ? "active" : ""}
              onClick={() => setParams(key ? { stage: key } : {})}
            >
              {label}
              <span>
                {key
                  ? tracked.filter((s) => state.tracked[s.id].stage === key)
                      .length
                  : tracked.length}
              </span>
            </button>
          ),
        )}
      </div>
      {results.length ? (
        <div className="tracker-list">
          {results.map((s) => {
            const t = state.tracked[s.id];
            const done = s.documents.filter((d) =>
              t.documents.includes(d),
            ).length;
            return (
              <article key={s.id} className="tracker-card">
                <div className="tracker-title">
                  <span className="provider-mark">{s.mark}</span>
                  <div>
                    <span className="context-label">Illustrative sample</span>
                    <h2>
                      <Link to={`/scholarships/${s.id}`}>{s.title}</Link>
                    </h2>
                    <p>{s.provider}</p>
                  </div>
                  <SaveButton s={s} compact />
                </div>
                <div className="tracker-content">
                  <div>
                    <Deadline s={s} />
                    <p className="muted">{dateLabel(s.deadline)}</p>
                  </div>
                  <div className="document-mini">
                    <span>
                      <FileText size={16} /> {done} / {s.documents.length}{" "}
                      documents ready
                    </span>
                    <progress
                      value={done}
                      max={s.documents.length}
                      aria-label={`Documents ready for ${s.title}`}
                    />
                  </div>
                  <StageSelect s={s} />
                </div>
                <div className="tracker-next">
                  <div>
                    <span className="context-label">Next action</span>
                    <p>{nextAction(s, state.profile, t)}</p>
                  </div>
                  <Link
                    className="button secondary"
                    to={`/scholarships/${s.id}`}
                  >
                    Continue
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty
          title={
            tracked.length
              ? "Nothing at this stage."
              : "Your shortlist starts here."
          }
          description={
            tracked.length
              ? "Move an application to this stage, or view all your opportunities."
              : "Save a scholarship you’re interested in. We’ll help you turn it into an actionable plan."
          }
        >
          {tracked.length ? (
            <button className="button" onClick={() => setParams({})}>
              View all applications
            </button>
          ) : (
            <ButtonLink to="/discover">Discover scholarships</ButtonLink>
          )}
        </Empty>
      )}
    </>
  );
}
