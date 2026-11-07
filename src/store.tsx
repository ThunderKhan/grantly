import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { catalog } from "./catalog";
import {
  decode,
  initialState,
  validDateString,
  type AppState,
  type Profile,
  type Stage,
  type DecisionOutcome,
} from "./model";
export const STORAGE_KEY = "grantly:demo:v1";
function load() {
  try {
    return {
      state: decode(
        localStorage.getItem(STORAGE_KEY),
        catalog.map((s) => s.id),
      ),
      error: "",
    };
  } catch {
    return {
      state: structuredClone(initialState),
      error:
        "Saved data could not be read. You can keep exploring; save new progress to start again.",
    };
  }
}
function useWorkspace() {
  const [loaded] = useState(load);
  const [state, setState] = useState<AppState>(loaded.state);
  const [storageError, setStorageError] = useState(loaded.error);
  const [notice, setNotice] = useState("");
  // Do not overwrite unreadable data until the student changes something.
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is unavailable. Changes work here but may be lost when you refresh.",
      );
    }
  }, [state, dirty]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  function change(fn: (s: AppState) => AppState, message?: string) {
    setDirty(true);
    setState(fn);
    if (message) setNotice(message);
  }
  function saveProfile(profile: Profile) {
    change(
      (s) => ({ ...s, profile }),
      "Profile saved. Your opportunity matches are updated.",
    );
  }
  function track(id: string, stage?: Stage) {
    change(
      (s) => ({
        ...s,
        tracked: {
          ...s.tracked,
          [id]: {
            stage: stage ?? s.tracked[id]?.stage ?? "saved",
            documents: s.tracked[id]?.documents ?? [],
            notes: s.tracked[id]?.notes ?? "",
            updated: new Date().toISOString(),
            // Reopening an application must not display a stale decision.
            outcome: (stage ?? s.tracked[id]?.stage) === "decision_received"
              ? s.tracked[id]?.outcome : undefined,
            decisionDate: (stage ?? s.tracked[id]?.stage) === "decision_received"
              ? s.tracked[id]?.decisionDate : undefined,
          },
        },
      }),
      stage
        ? `Stage updated to ${stage.replace("_", " ")}. This is your personal record.`
        : "Scholarship saved to My Applications.",
    );
  }
  function setDecision(id: string, outcome: DecisionOutcome | "", date: string) {
    if (date && !validDateString(date)) return;
    change(
      (s) => {
        const existing = s.tracked[id];
        if (!existing || existing.stage !== "decision_received") return s;
        return {
          ...s,
          tracked: {
            ...s.tracked,
            [id]: {
              ...existing,
              outcome: outcome || undefined,
              decisionDate: date || undefined,
              updated: new Date().toISOString(),
            },
          },
        };
      },
      "Decision details saved in this browser.",
    );
  }
  function loadDemo() {
    // Demonstration records are unmistakably illustrative. Loading them
    // requires confirmation if the visitor has existing personal progress.
    const now = new Date().toISOString();
    const demo: AppState = {
      version: 1,
      profile: {
        name: "Demo student",
        level: "Undergraduate",
        field: "Computer science",
        region: "Uttar Pradesh",
        marks: "80",
        income: "",
      },
      tracked: {
        "next-gen-tech": {
          stage: "preparing",
          documents: ["Latest academic transcript"],
          notes: "Example: verify household-income conditions before applying.",
          updated: now,
        },
        "homegrown-talent": {
          stage: "saved",
          documents: [],
          notes: "Example: compare deadlines before preparing.",
          updated: now,
        },
      },
    };
    const validated = decode(JSON.stringify(demo), catalog.map((s) => s.id));
    change(() => validated, "Sample workspace loaded. Try changing a stage or checklist.");
  }
  function restore(workspace: AppState) {
    // Decode again at the store boundary, rather than trusting UI inputs.
    const checked = decode(
      JSON.stringify(workspace),
      catalog.map((s) => s.id),
    );
    change(() => checked, "Workspace restored from your local backup.");
  }
  function remove(id: string) {
    change(
      (s) => ({
        ...s,
        tracked: Object.fromEntries(
          Object.entries(s.tracked).filter(([key]) => key !== id),
        ),
      }),
      "Opportunity and its local preparation progress removed.",
    );
  }
  function document(id: string, name: string) {
    change((s) => {
      const t = s.tracked[id] ?? {
        stage: "saved" as Stage,
        documents: [],
        notes: "",
        updated: "",
      };
      return {
        ...s,
        tracked: {
          ...s.tracked,
          [id]: {
            ...t,
            documents: t.documents.includes(name)
              ? t.documents.filter((d) => d !== name)
              : [...t.documents, name],
            updated: new Date().toISOString(),
          },
        },
      };
    });
  }
  function notes(id: string, notes: string) {
    change((s) => {
      const t = s.tracked[id];
      return t
        ? {
            ...s,
            tracked: {
              ...s.tracked,
              [id]: { ...t, notes, updated: new Date().toISOString() },
            },
          }
        : s;
    });
  }
  function reset() {
    change(
      () => structuredClone(initialState),
      "Your local workspace has been reset.",
    );
  }
  return {
    state,
    storageError,
    notice,
    saveProfile,
    track,
    setDecision,
    loadDemo,
    restore,
    remove,
    document,
    notes,
    reset,
  };
}
const Context = createContext<ReturnType<typeof useWorkspace> | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const value = useWorkspace();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useStore() {
  const value = useContext(Context);
  if (!value) throw new Error("Workspace provider missing");
  return value;
}
