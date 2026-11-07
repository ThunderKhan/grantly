import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { catalog } from "./catalog";
import {
  defaultFilters,
  discover,
  levels,
  fields,
  regions,
  type Filters,
} from "./model";
import { useStore } from "./store";
import { Empty, ScholarshipCard, SectionTitle } from "./components";
import { Link } from "react-router-dom";
export function Discovery() {
  const { state } = useStore();
  const [params, setParams] = useSearchParams();
  const filters = {
    ...defaultFilters,
    ...Object.fromEntries(
      Object.entries(defaultFilters).map(([k, v]) => [k, params.get(k) ?? v]),
    ),
  } as Filters;
  const results = discover(catalog, filters, state.profile);
  const active = Object.entries(filters).filter(
    ([k, v]) => k !== "sort" && v,
  ).length;
  function set(key: keyof Filters, value: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== defaultFilters[key]) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }
  return (
    <>
      <SectionTitle
        eyebrow="FIND YOUR NEXT CHAPTER"
        title="Big ambitions. Real possibilities."
        description="Explore scholarships, understand your fit, and take your next step."
      />
      <div className="discovery-layout">
        <aside className="filter-panel">
          <div className="row">
            <h2>
              <SlidersHorizontal size={17} /> Refine your search
            </h2>
            <button className="reset-text" onClick={() => setParams({})}>
              Reset
            </button>
          </div>
          <label className="filter-label">
            Education level
            <select
              value={filters.level}
              onChange={(e) => set("level", e.target.value)}
            >
              <option value="">All study levels</option>
              {levels.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="filter-label">
            Field of study
            <select
              value={filters.field}
              onChange={(e) => set("field", e.target.value)}
            >
              <option value="">All fields</option>
              {fields.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="filter-label">
            State of residence
            <select
              value={filters.region}
              onChange={(e) => set("region", e.target.value)}
            >
              <option value="">All states</option>
              {regions.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="filter-label">
            Deadline
            <select
              value={filters.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            >
              <option value="">Any deadline</option>
              <option value="upcoming">Upcoming</option>
              <option value="soon">Within 30 days</option>
              <option value="expired">Deadline passed</option>
              <option value="unknown">Not specified</option>
            </select>
          </label>
          <fieldset className="fit-filter">
            <legend>Fit with your profile</legend>
            {["", "Potential match", "Needs verification", "Review fit"].map(
              (x) => (
                <label key={x}>
                  <input
                    type="radio"
                    name="fit"
                    value={x}
                    checked={filters.fit === x}
                    onChange={() => set("fit", x)}
                  />
                  {x || "All opportunities"}
                </label>
              ),
            )}
          </fieldset>
          <div className="filter-note">
            <Sparkles size={20} />
            <strong>A better fit starts with you.</strong>
            <p>
              Add your study details to see what matches and what needs
              checking.
            </p>
            <Link to="/profile" className="text-link">
              Edit my profile <ArrowUpRight size={16} />
            </Link>
          </div>
        </aside>
        <section className="results" aria-label="Scholarship results">
          <div className="search-bar">
            <Search size={21} />
            <input
              aria-label="Search scholarships"
              placeholder="Search scholarships, providers, or subjects…"
              value={filters.query}
              onChange={(e) => set("query", e.target.value)}
            />
            {filters.query && (
              <button className="reset-text" onClick={() => set("query", "")}>
                Clear
              </button>
            )}
          </div>
          <div className="results-toolbar">
            <p aria-live="polite">
              <strong>{results.length}</strong> opportunities
              {active > 0 && (
                <span className="active-filter-count">
                  {active} active filter{active === 1 ? "" : "s"}
                </span>
              )}
            </p>
            <label className="sort-label">
              Sort by
              <select
                value={filters.sort}
                onChange={(e) => set("sort", e.target.value)}
              >
                <option value="relevance">Profile relevance</option>
                <option value="deadline">Nearest deadline</option>
                <option value="award">Highest award</option>
              </select>
            </label>
          </div>
          <div className="sample-note">
            <span className="tiny-dot" /> Demo catalog. All providers, awards,
            and deadlines below are illustrative.
          </div>
          {results.length ? (
            <div className="cards-grid">
              {results.map((s) => (
                <ScholarshipCard key={s.id} s={s} />
              ))}
            </div>
          ) : (
            <Empty
              title="Let’s widen the search."
              description="No opportunities match this combination. Try another subject or clear your filters."
            >
              <button className="button" onClick={() => setParams({})}>
                <RotateCcw size={16} /> Reset search & filters
              </button>
            </Empty>
          )}
        </section>
      </div>
    </>
  );
}
