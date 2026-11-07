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
  isSample: true;
};
export type Tracked = {
  stage: Stage;
  documents: string[];
  notes: string;
  updated: string;
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
  return s.rules.map((r) => {
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
      if (filters.sort === "deadline") {
        const av = daysUntil(a.deadline, now),
          bv = daysUntil(b.deadline, now);
        const rank = (v: number | undefined) =>
          v === undefined ? Infinity : v < 0 ? 100000 + Math.abs(v) : v;
        return rank(av) - rank(bv);
      }
      return relevance(b, p) - relevance(a, p);
    });
}
export function nextAction(s: Scholarship, p: Profile, t?: Tracked) {
  if (t?.stage === "decision_received")
    return "Record your outcome in your personal notes.";
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
    (p.marks !== "" &&
      (!Number.isFinite(Number(p.marks)) ||
        Number(p.marks) < 0 ||
        Number(p.marks) > 100))
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
      t.documents.some((d) => typeof d !== "string") ||
      typeof t.notes !== "string" ||
      t.notes.length > 2000 ||
      typeof t.updated !== "string"
    )
      throw new Error("Invalid tracking data");
    tracked[id] = {
      stage: t.stage as Stage,
      documents: t.documents as string[],
      notes: t.notes,
      updated: t.updated,
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
