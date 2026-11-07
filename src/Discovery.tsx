import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigationType,
  useSearchParams,
} from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { AnimatedGroup } from "./motion";
import { catalog } from "./catalog";
import {
  defaultFilters,
  readFilters,
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const navigationType = useNavigationType();
  const location = useLocation();
  const [filters, setFilters] = useState<Filters>(() => readFilters(params));
  // Keep typing synchronous. Router transitions must not rewrite an input mid-keystroke.
  // Back/forward and navigation from other views still restore the URL's filters.
  useEffect(() => {
    if (navigationType !== "REPLACE")
      setFilters(readFilters(new URLSearchParams(location.search)));
  }, [location.key, location.search, navigationType]);
  const results = discover(catalog, filters, state.profile);
  const active = Object.entries(filters).filter(
    ([k, v]) => k !== "sort" && v,
  ).length;
  function set(key: keyof Filters, value: string) {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(nextFilters)) {
      if (value && value !== defaultFilters[key as keyof Filters])
        next.set(key, value);
    }
    setParams(next, { replace: true });
  }
  function resetFilters() {
    setFilters({ ...defaultFilters });
    setParams({}, { replace: true });
  }
  return (
    <>
      <SectionTitle
        title="Discover scholarships"
        description="Search by subject or provider, then check the requirements against your profile."
      />
      <div className="discovery-layout">
        <aside className="filter-panel">
          <div className="row">
            <h2>
              <SlidersHorizontal size={17} /> Filters
            </h2>
            <button className="reset-text" onClick={resetFilters}>
              Reset
            </button>
            <button
              className="mobile-filter-toggle"
              aria-expanded={filtersOpen}
              aria-controls="filter-fields"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              {filtersOpen ? "Hide filters" : "Show filters"}
              <ChevronDown size={16} />
            </button>
          </div>
          <div
            id="filter-fields"
            className={`filter-fields ${filtersOpen ? "expanded" : ""}`}
          >
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
              <strong>Personalize your results</strong>
              <p>
                Add your study details to see what matches and what needs
                checking.
              </p>
              <Link to="/profile" className="text-link">
                Edit my profile
              </Link>
            </div>
          </div>
        </aside>
        <section className="results" aria-label="Scholarship results">
          <div className="search-bar">
            <Search size={21} />
            <input
              aria-label="Search scholarships"
              maxLength={200}
              placeholder="Search scholarships or providers…"
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
          {results.length ? (
            <AnimatedGroup className="cards-grid">
              {results.map((s) => (
                <ScholarshipCard key={s.id} s={s} />
              ))}
            </AnimatedGroup>
          ) : (
            <Empty
              title="Let’s widen the search."
              description="No opportunities match this combination. Try another subject or clear your filters."
            >
              <button className="button" onClick={resetFilters}>
                <RotateCcw size={16} /> Reset search & filters
              </button>
            </Empty>
          )}
        </section>
      </div>
    </>
  );
}
