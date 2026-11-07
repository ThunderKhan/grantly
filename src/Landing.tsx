import { Link } from "react-router-dom";
import { catalog } from "./catalog";
import { assess, daysUntil, fields, money, relevance } from "./model";
import { ButtonLink, Deadline, FitBadge, SaveButton } from "./components";
import { useStore } from "./store";
import "./landing.css";

export function Landing() {
  const { state } = useStore();
  const opportunity =
    [...catalog]
      .filter((s) => (daysUntil(s.deadline) ?? 1) >= 0)
      .sort(
        (a, b) => relevance(b, state.profile) - relevance(a, state.profile),
      )[0] ?? catalog[0];
  const criteria = assess(opportunity, state.profile);
  const hasProgress =
    Object.keys(state.tracked).length > 0 ||
    Object.values(state.profile).some(Boolean);
  return (
    <div className="landing">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">For your next chapter</p>
          <h1 id="landing-title">
            Find a scholarship.
            <br />
            See your next step.
          </h1>
          <p className="landing-intro">
            Your education has a lot ahead of it. Find opportunities that fit
            your studies, understand the requirements, and keep your
            applications moving.
          </p>
          <div className="landing-actions">
            <ButtonLink to="/discover">Find scholarships</ButtonLink>
            <Link className="text-link" to="/dashboard">
              {hasProgress ? "Continue your workspace" : "Open your workspace"}
            </Link>
          </div>
          <p className="landing-hero-note">
            Start exploring. Add your study details whenever you’re ready.
          </p>
        </div>
        <div className="landing-opportunity">
          <div className="landing-opportunity-top">
            <span className="landing-preview-label">
              An opportunity, explained
            </span>
            <SaveButton s={opportunity} compact />
          </div>
          <p className="landing-provider">{opportunity.provider}</p>
          <h2>{opportunity.title}</h2>
          <div className="landing-award">
            <strong>{money(opportunity.amount)}</strong>
            <span>
              {opportunity.amount
                ? "toward your education"
                : opportunity.benefit}
            </span>
          </div>
          <div className="landing-fit-heading">
            <h3>Your fit, requirement by requirement</h3>
            <FitBadge s={opportunity} />
          </div>
          <ul className="landing-criteria">
            {criteria.map((criterion) => (
              <li key={criterion.label}>
                <span>{criterion.label}</span>
                <strong className={`landing-criterion-${criterion.status}`}>
                  {criterion.status === "match"
                    ? "Matched"
                    : criterion.status === "unknown"
                      ? "Needs verification"
                      : "Review requirement"}
                </strong>
              </li>
            ))}
          </ul>
          <div className="landing-opportunity-bottom">
            <Deadline s={opportunity} />
            <Link className="text-link" to={`/scholarships/${opportunity.id}`}>
              See requirements
            </Link>
          </div>
          <p className="landing-sample-label">
            Illustrative sample opportunity
          </p>
        </div>
      </section>

      <section className="landing-journey" aria-labelledby="journey-title">
        <div className="landing-section-copy">
          <p className="landing-eyebrow">A clearer way forward</p>
          <h2 id="journey-title">
            From “where do I look?”
            <br />
            to “what’s next?”
          </h2>
          <p>
            Bring the search, the requirements, and your preparation together.
            Pick up wherever you are.
          </p>
        </div>
        <ol className="landing-steps">
          <li>
            <span className="landing-step-number">1</span>
            <div>
              <h3>
                <Link to="/discover">Find your starting point</Link>
              </h3>
              <p>
                Search by subject or provider. Narrow things down by study
                level, location, and deadline.
              </p>
            </div>
          </li>
          <li>
            <span className="landing-step-number">2</span>
            <div>
              <h3>
                <Link to="/profile">Understand what fits</Link>
              </h3>
              <p>
                Add the details you know. See which requirements match and which
                still need checking.
              </p>
            </div>
          </li>
          <li>
            <span className="landing-step-number">3</span>
            <div>
              <h3>
                <Link to="/applications">Turn interest into a plan</Link>
              </h3>
              <p>
                Save opportunities, prepare your documents, and keep your
                deadlines and application stages in view.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="landing-subjects" aria-labelledby="subjects-title">
        <div>
          <p className="landing-eyebrow">Begin with what you study</p>
          <h2 id="subjects-title">There’s a place to start.</h2>
        </div>
        <div className="landing-subject-links">
          {fields.map((field) => (
            <Link
              key={field}
              to={`/discover?${new URLSearchParams({ field })}`}
            >
              {field}
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-closing" aria-labelledby="closing-title">
        <div>
          <h2 id="closing-title">
            Your next chapter.
            <br />A little more organized.
          </h2>
          <p>
            Build a profile, make a shortlist, and take it one step at a time.
          </p>
        </div>
        <ButtonLink to="/profile">Build your student profile</ButtonLink>
      </section>
    </div>
  );
}
