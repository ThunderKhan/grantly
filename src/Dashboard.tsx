import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  FileCheck2,
  FolderOpen,
  Sparkles,
  Check,
  CircleHelp,
} from "lucide-react";
import { catalog } from "./catalog";
import { useStore } from "./store";
import { daysUntil, nextAction, relevance } from "./model";
import { ButtonLink, PaperIllustration, ScholarshipCard } from "./components";
export function Dashboard() {
  const { state, storageError } = useStore();
  const tracked = catalog.filter((s) => state.tracked[s.id]);
  const deadlines = tracked
    .filter(
      (s) =>
        state.tracked[s.id].stage !== "decision_received" &&
        state.tracked[s.id].stage !== "applied" &&
        daysUntil(s.deadline) !== undefined,
    )
    .sort((a, b) => daysUntil(a.deadline)! - daysUntil(b.deadline)!);
  const upcoming = deadlines.filter(
    (s) => daysUntil(s.deadline)! >= 0 && daysUntil(s.deadline)! <= 30,
  );
  const profileCount = Object.entries(state.profile).filter(
    ([k, v]) => k !== "name" && v,
  ).length;
  const recommendations = catalog
    .filter((s) => !state.tracked[s.id] && (daysUntil(s.deadline) ?? 1) >= 0)
    .sort((a, b) => relevance(b, state.profile) - relevance(a, state.profile))
    .slice(0, 2);
  const stats = [
    {
      label: "Saved opportunities",
      value: tracked.length,
      to: "/applications",
      Icon: Bookmark,
    },
    {
      label: "In preparation",
      value: tracked.filter((s) => state.tracked[s.id].stage === "preparing")
        .length,
      to: "/applications?stage=preparing",
      Icon: FolderOpen,
    },
    {
      label: "Applied by you",
      value: tracked.filter((s) => state.tracked[s.id].stage === "applied")
        .length,
      to: "/applications?stage=applied",
      Icon: FileCheck2,
    },
    {
      label: "Due within 30 days",
      value: upcoming.length,
      to: "/applications",
      Icon: CalendarDays,
    },
  ];
  return (
    <>
      <div className="dashboard-welcome">
        <span className="eyebrow">YOUR SCHOLARSHIP WORKSPACE</span>
        <span className="local-label">
          <span className="tiny-dot" />{" "}
          {storageError
            ? "Session only · storage unavailable"
            : "Saved on this browser"}
        </span>
      </div>
      <section className="welcome-band">
        <div className="welcome-copy">
          <h1>
            {state.profile.name
              ? `Your next chapter, ${state.profile.name}.`
              : "Big dreams deserve a clear next step."}
          </h1>
          <p>
            Find the right opportunities. Understand your fit.
            <br className="desktop-break" /> Turn a promising scholarship into a
            plan.
          </p>
          <ButtonLink to="/discover">Explore scholarships</ButtonLink>
        </div>
        <PaperIllustration />
      </section>
      <div className="stats-grid">
        {stats.map(({ label, value, to, Icon }) => (
          <Link key={label} to={to} className="stat-card">
            <div>
              <span className="stat-label">{label}</span>
              <Icon size={18} />
            </div>
            <strong>{String(value).padStart(2, "0")}</strong>
            <ArrowUpRight className="stat-arrow" size={17} />
          </Link>
        ))}
      </div>
      <div className="dashboard-body">
        <div>
          <div className="subheading">
            <div>
              <span className="eyebrow">A LITTLE DIRECTION</span>
              <h2>Make your next move.</h2>
            </div>
            <Sparkles size={21} />
          </div>
          <div className="next-actions">
            {profileCount < 5 && (
              <Link to="/profile" className="action-row">
                <span className="action-number">01</span>
                <div>
                  <h3>
                    {profileCount
                      ? "Give your matches more context"
                      : "Make this workspace yours"}
                  </h3>
                  <p>
                    Add your student profile · {profileCount} of 5 matching
                    fields filled
                  </p>
                </div>
                <ArrowUpRight size={19} />
              </Link>
            )}
            {tracked.slice(0, profileCount < 5 ? 2 : 3).map((s, i) => (
              <Link
                to={`/scholarships/${s.id}`}
                key={s.id}
                className="action-row"
              >
                <span className="action-number">
                  {String(i + (profileCount < 5 ? 2 : 1)).padStart(2, "0")}
                </span>
                <div>
                  <h3>{nextAction(s, state.profile, state.tracked[s.id])}</h3>
                  <p>{s.title}</p>
                </div>
                <ArrowUpRight size={19} />
              </Link>
            ))}
            {!tracked.length && (
              <Link to="/discover" className="action-row">
                <span className="action-number">
                  {profileCount < 5 ? "02" : "01"}
                </span>
                <div>
                  <h3>Find an opportunity worth pursuing</h3>
                  <p>
                    Explore {catalog.length} illustrative scholarships and save
                    your shortlist
                  </p>
                </div>
                <ArrowUpRight size={19} />
              </Link>
            )}
          </div>
          <div className="subheading recommendation-heading">
            <div>
              <span className="eyebrow">
                {profileCount ? "BASED ON YOUR PROFILE" : "A PLACE TO START"}
              </span>
              <h2>
                {profileCount
                  ? "Worth a closer look."
                  : "Explore the possibilities."}
              </h2>
            </div>
            <Link className="text-link" to="/discover">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <p className="recommendation-note">
            {profileCount
              ? "Ordered by matched and mismatched criteria. Review every requirement before deciding."
              : "Add a profile for personal matching. All opportunities below are illustrative samples."}
          </p>
          <div className="cards-grid">
            {recommendations.map((s) => (
              <ScholarshipCard s={s} key={s.id} />
            ))}
          </div>
        </div>
        <aside className="dashboard-aside">
          <section className="deadline-panel">
            <div className="row">
              <h2>Your deadlines</h2>
              <CalendarDays size={19} />
            </div>
            <p className="muted">The dates that need your attention.</p>
            {deadlines.length ? (
              <div className="deadline-list">
                {deadlines.slice(0, 4).map((s) => {
                  const d = daysUntil(s.deadline)!;
                  return (
                    <Link to={`/scholarships/${s.id}`} key={s.id}>
                      <span className={`date-block ${d < 0 ? "past" : ""}`}>
                        <strong>
                          {new Date(`${s.deadline}T00:00:00`).getDate()}
                        </strong>
                        <small>
                          {new Date(
                            `${s.deadline}T00:00:00`,
                          ).toLocaleDateString("en-IN", { month: "short" })}
                        </small>
                      </span>
                      <div>
                        <h3>{s.title}</h3>
                        <p>
                          {d < 0
                            ? "Deadline passed"
                            : d === 0
                              ? "Due today"
                              : `${d} days left`}{" "}
                          · sample date
                        </p>
                      </div>
                      <ArrowUpRight size={16} />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="no-deadlines">
                <CalendarDays size={30} />
                <h3>A little breathing room.</h3>
                <p>
                  Save a scholarship to see its deadline here. We’ll keep the
                  next step in sight.
                </p>
              </div>
            )}
            <Link className="text-link" to="/applications">
              View applications <ArrowRight size={15} />
            </Link>
          </section>
          <section className="explain-panel">
            <span className="eyebrow">CLARITY OVER GUESSWORK</span>
            <h2>A match you can understand.</h2>
            <p>
              Every recommendation comes with reasons, so you can make your own
              call.
            </p>
            <div>
              <span>
                <Check size={16} /> What matches
              </span>
              <span>
                <CircleHelp size={16} /> What needs checking
              </span>
            </div>
            <Link to="/discover" className="text-link">
              Find your fit <ArrowUpRight size={16} />
            </Link>
          </section>
          <p className="dashboard-disclosure">
            A frontend demonstration with illustrative opportunities. No real
            applications or eligibility decisions.
          </p>
        </aside>
      </div>
      <div className="journey-note">
        <span className="logo-mark small">
          <Sparkles size={18} />
        </span>
        <p>One journey. Less juggling.</p>
        <span>
          Discover <ArrowRight size={13} /> Understand <ArrowRight size={13} />{" "}
          Prepare <ArrowRight size={13} /> Track
        </span>
      </div>
    </>
  );
}
