import { Link } from "react-router-dom";
import {
  Bookmark,
  CalendarDays,
  FileCheck2,
  FolderOpen,
  UserRound,
  ClipboardList,
  Compass,
} from "lucide-react";
import { catalog } from "./catalog";
import { useStore } from "./store";
import { daysUntil, nextAction, relevance } from "./model";
import { ButtonLink, Empty, ScholarshipCard } from "./components";
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
              ? `Your scholarships, ${state.profile.name}.`
              : "Your scholarship workspace."}
          </h1>
          <p>
            Find funding that fits your studies, check the requirements, and
            keep track of your applications.
          </p>
          <ButtonLink to="/discover">Explore scholarships</ButtonLink>
        </div>
        <div className="profile-snapshot">
          <h2>Your matching profile</h2>
          <p>
            <strong>{profileCount} of 5</strong> details added
          </p>
          <progress
            value={profileCount}
            max={5}
            aria-label="Matching profile details added"
          />
          <Link to="/profile" className="text-link">
            {profileCount ? "Edit profile" : "Set up your profile"}
          </Link>
        </div>
      </section>
      <div className="stats-grid">
        {stats.map(({ label, value, to, Icon }) => (
          <Link key={label} to={to} className="stat-card">
            <div>
              <span className="stat-label">{label}</span>
              <Icon size={18} />
            </div>
            <strong>{value}</strong>
          </Link>
        ))}
      </div>
      <div className="dashboard-body">
        <div>
          <div className="subheading">
            <div>
              <h2>Next actions</h2>
            </div>
          </div>
          <div className="next-actions">
            {profileCount < 5 && (
              <Link to="/profile" className="action-row">
                <span className="action-icon">
                  <UserRound size={18} />
                </span>
                <div>
                  <h3>
                    {profileCount
                      ? "Complete your matching details"
                      : "Add your student profile"}
                  </h3>
                  <p>
                    Add your student profile · {profileCount} of 5 matching
                    fields filled
                  </p>
                </div>
              </Link>
            )}
            {tracked.slice(0, profileCount < 5 ? 2 : 3).map((s) => (
              <Link
                to={`/scholarships/${s.id}`}
                key={s.id}
                className="action-row"
              >
                <span className="action-icon">
                  <ClipboardList size={18} />
                </span>
                <div>
                  <h3>{nextAction(s, state.profile, state.tracked[s.id])}</h3>
                  <p>{s.title}</p>
                </div>
              </Link>
            ))}
            {!tracked.length && (
              <Link to="/discover" className="action-row">
                <span className="action-icon">
                  <Compass size={18} />
                </span>
                <div>
                  <h3>Build your scholarship shortlist</h3>
                  <p>
                    Explore {catalog.length} illustrative scholarships and save
                    your shortlist
                  </p>
                </div>
              </Link>
            )}
          </div>
          <div className="subheading recommendation-heading">
            <div>
              <h2>
                {profileCount
                  ? "Recommended for your profile"
                  : "Scholarships to explore"}
              </h2>
            </div>
            <Link className="text-link" to="/discover">
              View all
            </Link>
          </div>
          <p className="recommendation-note">
            {profileCount
              ? "Ordered by matched and mismatched criteria. Review every requirement before deciding."
              : "Add a profile for personal matching. All opportunities below are illustrative samples."}
          </p>
          {recommendations.length ? (
            <div className="cards-grid">
              {recommendations.map((s) => (
                <ScholarshipCard s={s} key={s.id} />
              ))}
            </div>
          ) : (
            <Empty
              title="Your shortlist is complete."
              description="You’ve saved every opportunity in the sample catalog. Continue preparing your applications, or revisit the ones you’ve saved."
            >
              <ButtonLink to="/applications">View applications</ButtonLink>
            </Empty>
          )}
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
              View applications
            </Link>
          </section>
          <p className="dashboard-disclosure">
            A frontend demonstration with illustrative opportunities. No real
            applications or eligibility decisions.
          </p>
        </aside>
      </div>
    </>
  );
}
