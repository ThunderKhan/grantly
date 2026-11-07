import { CalendarPlus } from "lucide-react";
import type { Scholarship } from "./model";

export function makeCalendarEvent(s: Scholarship) {
  if (!s.deadline) return null;
  const start = s.deadline.replaceAll("-", "");
  const endDate = new Date(`${s.deadline}T00:00:00Z`);
  if (!Number.isFinite(endDate.valueOf())) return null;
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  const end = endDate.toISOString().slice(0, 10).replaceAll("-", "");
  const stamp = new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\\.\\d{3}Z$/, "Z");
  const safe = (value: string) => value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
  const title = `${s.isSample ? "Sample deadline" : "Check deadline"}: ${s.title}`;
  const description = s.isSample
    ? "Illustrative scholarship only; this is not a real application deadline."
    : `Confirm the current date before applying. Official listing: ${s.sourceUrl ?? "National Scholarship Portal"}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GRANTLY//Scholarship Reminder//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:grantly-${s.id}-${start}@local`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${safe(title)}`,
    `DESCRIPTION:${safe(description)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-P7D",
    `DESCRIPTION:${safe(title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n") + "\r\n";
}

export function CalendarDownload({ s }: { s: Scholarship }) {
  if (!s.deadline) return null;
  function download() {
    const ics = makeCalendarEvent(s);
    if (!ics) return;
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `grantly-${s.id}-deadline.ics`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  return (
    <button type="button" className="reset-text calendar-download" onClick={download}>
      <CalendarPlus size={16} /> Add deadline to calendar
    </button>
  );
}
