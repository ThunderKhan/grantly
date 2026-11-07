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
  type AppState,
  type Profile,
  type Stage,
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
          },
        },
      }),
      stage
        ? `Stage updated to ${stage.replace("_", " ")}. This is your personal record.`
        : "Scholarship saved to My Applications.",
    );
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
