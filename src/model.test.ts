import { describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import {
  assess,
  daysUntil,
  deadlineLabel,
  decode,
  defaultFilters,
  discover,
  emptyProfile,
  fit,
  initialState,
  nextAction,
  relevance,
} from "./model";
const ids = catalog.map((s) => s.id);
const tech = catalog[0];
const profile = {
  ...emptyProfile,
  level: "Undergraduate",
  field: "Computer science",
  region: "Uttar Pradesh",
  marks: "80",
  income: "Up to ₹2.5 lakh",
};
const now = new Date("2026-11-07T12:00:00Z");
describe("explainable matching", () => {
  it("leaves every missing criterion unknown", () => {
    expect(
      assess(tech, emptyProfile).every((r) => r.status === "unknown"),
    ).toBe(true);
    expect(fit(tech, emptyProfile)).toBe("Needs verification");
  });
  it("matches exact supported values and inclusive grade boundaries", () => {
    expect(
      assess(tech, { ...profile, marks: "70" }).every(
        (r) => r.status === "match",
      ),
    ).toBe(true);
    expect(fit(tech, profile)).toBe("Potential match");
  });
  it("retains mixed matched, unknown and mismatch explanations", () => {
    const result = assess(tech, { ...profile, marks: "69", income: "" });
    expect(result.map((r) => r.status)).toEqual([
      "match",
      "match",
      "possible_mismatch",
      "unknown",
    ]);
    expect(result.every((r) => r.reason.length > 20)).toBe(true);
    expect(fit(tech, { ...profile, level: "Postgraduate" })).toBe("Review fit");
  });
  it("does not treat zero as missing", () =>
    expect(assess(tech, { ...profile, marks: "0" })[2].status).toBe(
      "possible_mismatch",
    ));
  it("gives known mismatches lower relevance", () =>
    expect(relevance(tech, profile)).toBeGreaterThan(
      relevance(tech, { ...profile, level: "Postgraduate" }),
    ));
});
describe("discovery and deadlines", () => {
  it("composes title, level, field and region filters", () => {
    expect(
      discover(
        catalog,
        {
          ...defaultFilters,
          query: "homegrown",
          level: "Undergraduate",
          field: "Computer science",
          region: "Uttar Pradesh",
        },
        profile,
        now,
      ).map((s) => s.id),
    ).toEqual(["homegrown-talent"]);
    expect(
      discover(
        catalog,
        { ...defaultFilters, query: "homegrown", region: "Delhi" },
        profile,
        now,
      ),
    ).toHaveLength(0);
  });
  it("searches provider and field case insensitively", () => {
    expect(
      discover(
        catalog,
        { ...defaultFilters, query: "FUTUREPATH" },
        profile,
        now,
      )[0].id,
    ).toBe("next-gen-tech");
    expect(
      discover(
        catalog,
        { ...defaultFilters, query: "computer science" },
        profile,
        now,
      ).some((s) => s.id === "next-gen-tech"),
    ).toBe(true);
  });
  it("reset returns the full catalog and impossible query is empty", () => {
    expect(discover(catalog, defaultFilters, profile, now)).toHaveLength(
      catalog.length,
    );
    expect(
      discover(
        catalog,
        { ...defaultFilters, query: "unfindable-xyz" },
        profile,
        now,
      ),
    ).toHaveLength(0);
  });
  it("filters fit from profile data", () =>
    expect(
      discover(
        catalog,
        { ...defaultFilters, fit: "Potential match" },
        emptyProfile,
        now,
      ),
    ).toHaveLength(0));
  it("keeps expired and unspecified dates out of upcoming results", () => {
    const results = discover(
      catalog,
      { ...defaultFilters, deadline: "upcoming" },
      profile,
      now,
    );
    expect(results.every((s) => daysUntil(s.deadline, now)! >= 0)).toBe(true);
    expect(
      discover(
        catalog,
        { ...defaultFilters, deadline: "expired" },
        profile,
        now,
      ).map((s) => s.id),
    ).toEqual(["capital-scholars"]);
  });
  it("sorts known future dates first and unknown last", () => {
    const results = discover(
      catalog,
      { ...defaultFilters, sort: "deadline" },
      profile,
      now,
    );
    expect(results[0].id).toBe("open-doors");
    expect(results.at(-1)?.id).toBe("learning-without-limits");
  });
  it("sorts monetary awards without coercing non-cash to zero", () => {
    const results = discover(
      catalog,
      { ...defaultFilters, sort: "award" },
      profile,
      now,
    );
    expect(results[0].amount).toBe(120000);
    expect(results.at(-1)?.amount).toBeUndefined();
  });
  it("handles deadline boundaries and missing dates", () => {
    expect(daysUntil("2026-11-07", now)).toBe(0);
    expect(deadlineLabel("2026-11-07", now)).toBe("Due today");
    expect(deadlineLabel("2026-11-06", now)).toBe("Deadline passed");
    expect(deadlineLabel(undefined, now)).toBe("Deadline not specified");
    expect(daysUntil("invalid", now)).toBeUndefined();
  });
});
describe("persistence boundary and next actions", () => {
  it("roundtrips profile, stage, documents and notes", () => {
    const s = {
      ...initialState,
      profile,
      tracked: {
        [tech.id]: {
          stage: "preparing",
          documents: [tech.documents[0]],
          notes: "Sample note",
          updated: now.toISOString(),
        },
      },
    };
    expect(decode(JSON.stringify(s), ids)).toEqual(s);
  });
  it("supports fresh state and ignores removed scholarship records", () => {
    expect(decode(null, ids)).toEqual(initialState);
    expect(
      decode(JSON.stringify({ ...initialState, tracked: { removed: {} } }), ids)
        .tracked,
    ).toEqual({});
  });
  it("rejects malformed, old and structurally invalid storage", () => {
    for (const raw of [
      "{",
      JSON.stringify({ version: 0 }),
      JSON.stringify({
        ...initialState,
        profile: { ...emptyProfile, marks: "NaN" },
      }),
      JSON.stringify({
        ...initialState,
        tracked: {
          [tech.id]: {
            stage: "__proto__",
            documents: [],
            notes: "",
            updated: "",
          },
        },
      }),
    ])
      expect(() => decode(raw, ids)).toThrow();
  });
  it("rejects out of range percentages and invalid profile options", () => {
    expect(() =>
      decode(
        JSON.stringify({
          ...initialState,
          profile: { ...profile, marks: "101" },
        }),
        ids,
      ),
    ).toThrow();
    expect(() =>
      decode(
        JSON.stringify({
          ...initialState,
          profile: { ...profile, field: "Invented" },
        }),
        ids,
      ),
    ).toThrow();
  });
  it("prioritizes verification before preparation and derives the next unready document", () => {
    expect(nextAction(tech, emptyProfile)).toContain("Verify");
    expect(
      nextAction(tech, profile, {
        stage: "preparing",
        documents: [tech.documents[0]],
        notes: "",
        updated: "",
      }),
    ).toContain(tech.documents[1].toLowerCase());
  });
  it("uses self-reported stage to guide followup", () => {
    expect(
      nextAction(tech, profile, {
        stage: "applied",
        documents: [],
        notes: "",
        updated: "",
      }),
    ).toContain("provider");
    expect(
      nextAction(tech, profile, {
        stage: "decision_received",
        documents: [],
        notes: "",
        updated: "",
      }),
    ).toContain("outcome");
  });
  it("has unique IDs and sufficiently varied complete catalog records", () => {
    expect(new Set(ids).size).toBe(catalog.length);
    expect(
      catalog.every(
        (s) =>
          s.isSample && s.rules.length && s.documents.length && s.steps.length,
      ),
    ).toBe(true);
  });
});
