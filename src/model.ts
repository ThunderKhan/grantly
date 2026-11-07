export const levels = [
  "Secondary school",
  "Undergraduate",
  "Postgraduate",
] as const;
export const fields = [
  "Computer science",
  "Engineering",
  "Science",
  "Business",
  "Arts & humanities",
  "Medicine",
] as const;
export const regions = [
  "Uttar Pradesh",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Other Indian state",
] as const;
export const incomeBands = [
  "Up to ₹2.5 lakh",
  "₹2.5–5 lakh",
  "Above ₹5 lakh",
] as const;
export const stages = {
  saved: "Saved",
  preparing: "Preparing",
  applied: "Applied",
  decision_received: "Decision received",
} as const;
export type Stage = keyof typeof stages;
export const decisionOutcomes = {
  awarded: "Awarded",
  waitlisted: "Waitlisted",
  declined: "Not selected",
} as const;
export type DecisionOutcome = keyof typeof decisionOutcomes;
export type Profile = {
  name: string;
  level: string;
  field: string;
  region: string;
  marks: string;
  income: string;
};
export type Rule = {
  field: Exclude<keyof Profile, "name">;
  label: string;
  accepts?: readonly string[];
  minimum?: number;
};
export type Scholarship = {
  id: string;
  title: string;
  provider: string;
  mark: string;
  category: string;
  amount?: number;
  benefit: string;
  description: string;
  deadline?: string;
  rules: Rule[];
  documents: string[];
  steps: string[];
  isSample: boolean;
  sourceUrl?: string;
  applicationUrl?: string;
  checkedOn?: string;
  verificationNote?: string;
};
export type Tracked = {
  stage: Stage;
  documents: string[];
  notes: string;
  updated: string;
  outcome?: DecisionOutcome;
  decisionDate?: string;
};
export type AppState = {
  version: 1;
  profile: Profile;
  tracked: Record<string, Tracked>;
};
export const emptyProfile: Profile = {
  name: "",
  level: "",
  field: "",
  region: "",
  marks: "",
  income: "",
};
export const initialState: AppState = {
  version: 1,
  profile: emptyProfile,
  tracked: {},
};
export type Outcome = {
  label: string;
  status: "match" | "unknown" | "possible_mismatch";
  reason: string;
};
export function assess(s: Scholarship, p: Profile): Outcome[] {
  const outcomes: Outcome[] = s.rules.map((r) => {
    const value = p[r.field];
    if (value === "")
      return {
        label: r.label,
        status: "unknown",
        reason: `Your ${fieldLabels[r.field].toLowerCase()} is unknown. Add it to your profile or verify this requirement.`,
      };
    const matches =
      r.minimum !== undefined
        ? Number(value) >= r.minimum
        : Boolean(r.accepts?.includes(value));
    return {
      label: r.label,
      status: matches ? "match" : "possible_mismatch",
      reason: matches
        ? `Your answer (${value}${r.field === "marks" ? "%" : ""}) meets this sample requirement.`
        : `Your answer (${value}${r.field === "marks" ? "%" : ""}) differs from this sample requirement. Check the provider’s rules before applying.`,
    };
  });
  // A verified listing may have criteria outside this simple local profile.
  // Never turn a few known matches into a claim of full eligibility.
  if (s.verificationNote)
    outcomes.push({
      label: "Additional official conditions",
      status: "unknown",
      reason: s.verificationNote,
    });
  return outcomes;
}
export const fieldLabels = {
  level: "Education level",
  field: "Field of study",
  region: "State of residence",
  marks: "Academic percentage",
  income: "Household income band",
};
export function fit(s: Scholarship, p: Profile) {
  const a = assess(s, p);
  if (!a.length) return "Needs verification";
  return a.some((x) => x.status === "possible_mismatch")
    ? "Review fit"
    : a.some((x) => x.status === "unknown")
      ? "Needs verification"
      : "Potential match";
}
export function relevance(s: Scholarship, p: Profile) {
  const a = assess(s, p);
  return (
    a.filter((x) => x.status === "match").length -
    a.filter((x) => x.status === "possible_mismatch").length * 10
  );
}
export function daysUntil(date?: string, now = new Date()): number | undefined {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  const end = Date.parse(`${date}T00:00:00Z`);
  if (
    !Number.isFinite(end) ||
    new Date(end).toISOString().slice(0, 10) !== date
  )
    return undefined;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((end - today) / 86400000);
}
// Upcoming deadlines first, then overdue, then unspecified. Avoid burying
// the next real action behind long-expired examples.
export function compareDeadlinePriority(
  a?: string,
  b?: string,
  now = new Date(),
) {
  const rank = (date?: string) => {
    const d = daysUntil(date, now);
    return d === undefined ? Infinity : d < 0 ? 100000 + Math.abs(d) : d;
  };
  return rank(a) - rank(b);
}
export function prioritizedTracked(
  items: Scholarship[],
  tracked: Record<string, Tracked>,
  now = new Date(),
) {
  const stageRank = (stage: Stage) =>
    stage === "preparing" ? 0 : stage === "saved" ? 1 : stage === "applied" ? 2 : 3;
  return [...items].sort((a, b) => {
    const first = stageRank(tracked[a.id].stage) - stageRank(tracked[b.id].stage);
    return first || compareDeadlinePriority(a.deadline, b.deadline, now);
  });
}
export function deadlineLabel(date?: string, now = new Date()) {
  const days = daysUntil(date, now);
  return days === undefined
    ? "Deadline not specified"
    : days < 0
      ? "Deadline passed"
      : days === 0
        ? "Due today"
        : `Due in ${days} day${days === 1 ? "" : "s"}`;
}
export function dateLabel(date?: string) {
  return date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not specified";
}
export function awardLabel(s: Scholarship) {
  return s.amount === undefined && !s.isSample
    ? "See official scheme"
    : money(s.amount);
}
export function money(amount?: number) {
  return amount === undefined
    ? "Non-cash benefit"
    : `₹${amount.toLocaleString("en-IN")}`;
}
export type Filters = {
  query: string;
  level: string;
  field: string;
  region: string;
  fit: string;
  deadline: string;
  sort: string;
};
export const defaultFilters: Filters = {
  query: "",
  level: "",
  field: "",
  region: "",
  fit: "",
  deadline: "",
  sort: "relevance",
};
export function discover(
  catalog: Scholarship[],
  filters: Filters,
  p: Profile,
  now = new Date(),
) {
  return catalog
    .filter((s) => {
      if (
        !`${s.title} ${s.provider} ${s.category} ${s.description} ${s.rules.flatMap((r) => r.accepts ?? []).join(" ")}`
          .toLowerCase()
          .includes(filters.query.toLowerCase().trim())
      )
        return false;
      for (const field of ["level", "field", "region"] as const) {
        if (
          filters[field] &&
          s.rules.some(
            (r) => r.field === field && !r.accepts?.includes(filters[field]),
          )
        )
          return false;
      }
      if (filters.fit && fit(s, p) !== filters.fit) return false;
      const days = daysUntil(s.deadline, now);
      if (filters.deadline === "upcoming" && (days === undefined || days < 0))
        return false;
      if (
        filters.deadline === "soon" &&
        (days === undefined || days < 0 || days > 30)
      )
        return false;
      if (filters.deadline === "expired" && (days === undefined || days >= 0))
        return false;
      if (filters.deadline === "unknown" && days !== undefined) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "award") return (b.amount ?? -1) - (a.amount ?? -1);
      if (filters.sort === "deadline")
        return compareDeadlinePriority(a.deadline, b.deadline, now);
      return relevance(b, p) - relevance(a, p);
    });
}
export function nextAction(s: Scholarship, p: Profile, t?: Tracked) {
  if (t?.stage === "decision_received") {
    if (t.outcome === "awarded")
      return "Check the award instructions and record your next step.";
    if (t.outcome === "waitlisted")
      return "Check the provider for the next waitlist update.";
    if (t.outcome === "declined")
      return "Record your decision and explore other opportunities.";
    return "Record your decision outcome and date.";
  }
  if (t?.stage === "applied")
    return "Check the provider for a decision and update your stage.";
  if ((daysUntil(s.deadline) ?? 0) < 0)
    return "Sample deadline passed. Verify whether another cycle is available.";
  const outcomes = assess(s, p);
  const mismatch = outcomes.find((x) => x.status === "possible_mismatch");
  if (mismatch) return `Review requirement: ${mismatch.label.toLowerCase()}.`;
  const unknown = outcomes.find((x) => x.status === "unknown");
  if (unknown) return `Verify requirement: ${unknown.label.toLowerCase()}.`;
  const missing = s.documents.find((d) => !t?.documents.includes(d));
  if (missing) return `Prepare your ${missing.toLowerCase()}.`;
  return "Review the application steps before applying through the provider.";
}
const isObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
export function decode(raw: string | null, ids: readonly string[]): AppState {
  if (raw === null) return structuredClone(initialState);
  // Bound work before parsing browser-controlled storage.
  if (raw.length > 100_000)
    throw new Error("Stored data exceeds workspace limits");
  const v: unknown = JSON.parse(raw);
  if (
    !isObject(v) ||
    v.version !== 1 ||
    !isObject(v.profile) ||
    !isObject(v.tracked)
  )
    throw new Error("Unsupported stored data");
  const p = v.profile;
  if (Object.keys(emptyProfile).some((k) => typeof p[k] !== "string"))
    throw new Error("Invalid profile");
  if (
    (p.name as string).length > 60 ||
    ![...levels, ""].includes(p.level as (typeof levels)[number]) ||
    ![...fields, ""].includes(p.field as (typeof fields)[number]) ||
    ![...regions, ""].includes(p.region as (typeof regions)[number]) ||
    ![...incomeBands, ""].includes(p.income as (typeof incomeBands)[number]) ||
    !validMarks(p.marks as string)
  )
    throw new Error("Invalid profile values");
  const tracked: Record<string, Tracked> = {};
  for (const [id, t] of Object.entries(v.tracked)) {
    if (!ids.includes(id)) continue;
    if (
      !isObject(t) ||
      typeof t.stage !== "string" ||
      !Object.hasOwn(stages, t.stage) ||
      !Array.isArray(t.documents) ||
      t.documents.length > 30 ||
      t.documents.some((d) => typeof d !== "string" || d.length > 200) ||
      typeof t.notes !== "string" ||
      t.notes.length > 2000 ||
      typeof t.updated !== "string" ||
      t.updated.length > 40 ||
      (t.outcome !== undefined &&
        (!Object.hasOwn(decisionOutcomes, String(t.outcome)) ||
          t.stage !== "decision_received")) ||
      (t.decisionDate !== undefined &&
        (typeof t.decisionDate !== "string" ||
          !validDateString(t.decisionDate) ||
          t.stage !== "decision_received"))
    )
      throw new Error("Invalid tracking data");
    tracked[id] = {
      stage: t.stage as Stage,
      documents: [...new Set(t.documents as string[])],
      notes: t.notes,
      updated: t.updated,
      outcome: t.outcome as DecisionOutcome | undefined,
      decisionDate: t.decisionDate as string | undefined,
    };
  }
  return {
    version: 1,
    profile: {
      name: p.name,
      level: p.level,
      field: p.field,
      region: p.region,
      marks: p.marks,
      income: p.income,
    } as Profile,
    tracked,
  };
}

export function validDateString(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date;
}

// Use the same boundary for form input and persisted data. Unknown stays blank;
// hexadecimal, whitespace, and exponent strings are not academic percentages.
export function validMarks(value: string) {
  return (
    value === "" ||
    (/^\d{1,3}(?:\.\d{1,2})?$/.test(value) && Number(value) <= 100)
  );
}

export function readFilters(params: URLSearchParams): Filters {
  const option = (key: keyof Filters, values: readonly string[]) => {
    const value = params.get(key) ?? defaultFilters[key];
    return values.includes(value) ? value : defaultFilters[key];
  };
  return {
    query: (params.get("query") ?? "").slice(0, 200),
    level: option("level", ["", ...levels]),
    field: option("field", ["", ...fields]),
    region: option("region", ["", ...regions]),
    fit: option("fit", [
      "",
      "Potential match",
      "Needs verification",
      "Review fit",
    ]),
    deadline: option("deadline", [
      "",
      "upcoming",
      "soon",
      "expired",
      "unknown",
    ]),
    sort: option("sort", ["relevance", "deadline", "award"]),
  };
}
