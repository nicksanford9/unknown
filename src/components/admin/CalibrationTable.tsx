"use client";

import { useMemo, useRef, useState } from "react";
import { saveTier, saveVoiceNote, type Tier } from "@/lib/admin-actions";

export type Lead = {
  placeId: string;
  name: string;
  city: string | null;
  phone: string | null;
  phoneType: string | null;
  website: string | null;
  websiteStatus: string | null;
  rating: number | null;
  reviewCount: number | null;
  photoCount: number | null;
  reviewsLink: string | null;
  category: string | null;
  isChain: boolean | null;
  pipelineVerdict: string | null;
  pitchAngle: string | null;
  rejectReason: string | null;
  tier: Tier | null;
  voiceNote: string | null;
};

type Filter = "all" | "undecided" | "qualified" | "mobile" | "no-site" | "discuss";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "undecided", label: "Undecided" },
  { id: "qualified", label: "Pipeline ✓" },
  { id: "mobile", label: "Mobile #" },
  { id: "no-site", label: "No site" },
  { id: "discuss", label: "Discuss" },
];

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const TIER_STYLE: Record<Tier, string> = {
  build: "bg-emerald-600 text-white border-emerald-600",
  skip: "bg-rose-600 text-white border-rose-600",
  discuss: "bg-amber-500 text-white border-amber-500",
};

const PAGE_SIZE = 50;

type SortKey = "rating" | "reviews" | "photos";

const SORT_VALUE: Record<SortKey, (l: Lead) => number> = {
  rating: (l) => l.rating ?? -1,
  reviews: (l) => l.reviewCount ?? -1,
  photos: (l) => l.photoCount ?? -1,
};

/** Every lead gets a clickable Google-reviews URL — stored link, or built from the place ID. */
function reviewsUrl(lead: Lead) {
  return (
    lead.reviewsLink ??
    `https://search.google.com/local/reviews?placeid=${encodeURIComponent(lead.placeId)}`
  );
}

export function CalibrationTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [transcribingId, setTranscribingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const patch = (placeId: string, updates: Partial<Lead>) =>
    setLeads((ls) => ls.map((l) => (l.placeId === placeId ? { ...l, ...updates } : l)));

  const visible = useMemo(() => {
    let rows;
    switch (filter) {
      case "undecided": rows = leads.filter((l) => !l.tier); break;
      case "qualified": rows = leads.filter((l) => l.pipelineVerdict === "qualified"); break;
      case "mobile": rows = leads.filter((l) => l.phoneType === "mobile"); break;
      case "no-site": rows = leads.filter((l) => !l.website); break;
      case "discuss": rows = leads.filter((l) => l.tier === "discuss"); break;
      default: rows = leads;
    }
    if (sort) {
      const value = SORT_VALUE[sort.key];
      rows = [...rows].sort((a, b) => (value(b) - value(a)) * sort.dir);
    }
    return rows;
  }, [leads, filter, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s?.key !== key ? { key, dir: 1 } : s.dir === 1 ? { key, dir: -1 } : null,
    );
    setPage(0);
  }

  const decided = leads.filter((l) => l.tier).length;
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = visible.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function switchFilter(f: Filter) {
    setFilter(f);
    setPage(0);
  }

  async function setTier(lead: Lead, tier: Tier) {
    patch(lead.placeId, { tier });
    try {
      await saveTier(lead.placeId, tier);
    } catch {
      patch(lead.placeId, { tier: lead.tier });
      setError(`Couldn't save verdict for ${lead.name}`);
    }
  }

  async function toggleRecording(lead: Lead) {
    setError(null);
    if (recordingId === lead.placeId) {
      recorderRef.current?.stop();
      return;
    }
    if (recordingId) recorderRef.current?.stop();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecordingId(null);
        const blob = new Blob(chunksRef.current, { type: mimeType });
        await transcribe(lead, blob);
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecordingId(lead.placeId);
    } catch {
      setError("Microphone access denied — check browser permissions.");
    }
  }

  async function transcribe(lead: Lead, blob: Blob) {
    setTranscribingId(lead.placeId);
    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Transcription failed");
      const current = leads.find((l) => l.placeId === lead.placeId)?.voiceNote;
      const note = current ? `${current}\n${data.transcript}` : data.transcript;
      patch(lead.placeId, { voiceNote: note });
      await saveVoiceNote(lead.placeId, note);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transcription failed");
    } finally {
      setTranscribingId(null);
    }
  }

  async function editNote(lead: Lead, note: string) {
    patch(lead.placeId, { voiceNote: note });
    try {
      await saveVoiceNote(lead.placeId, note);
    } catch {
      setError(`Couldn't save note for ${lead.name}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-6 sm:px-8">
      <header className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Lead calibration</h1>
          <p className="text-sm text-zinc-400">
            Birmingham plumbers · {decided}/{leads.length} decided ·{" "}
            {leads.filter((l) => l.tier === "build").length} build
          </p>
        </div>
        <nav className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => switchFilter(f.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                filter === f.id
                  ? "border-zinc-100 bg-zinc-100 text-zinc-900"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </nav>
      </header>

      {error && (
        <p className="mb-4 rounded border border-rose-800 bg-rose-950 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-3 py-2.5">Business</th>
              <th className="px-3 py-2.5">Phone</th>
              <th className="px-3 py-2.5">Site</th>
              <SortHeader label="Rating" sortKey="rating" sort={sort} onSort={toggleSort} />
              <SortHeader label="Reviews" sortKey="reviews" sort={sort} onSort={toggleSort} />
              <SortHeader label="Photos" sortKey="photos" sort={sort} onSort={toggleSort} />
              <th className="px-3 py-2.5">Pipeline</th>
              <th className="px-3 py-2.5">Verdict</th>
              <th className="px-3 py-2.5">Why</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((lead) => (
              <Row
                key={lead.placeId}
                lead={lead}
                recording={recordingId === lead.placeId}
                transcribing={transcribingId === lead.placeId}
                onTier={(t) => setTier(lead, t)}
                onMic={() => toggleRecording(lead)}
                onNote={(n) => editNote(lead, n)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
        <span>
          Showing {visible.length === 0 ? 0 : safePage * PAGE_SIZE + 1}–
          {Math.min((safePage + 1) * PAGE_SIZE, visible.length)} of {visible.length}
          {filter !== "all" && ` (filtered from ${leads.length})`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, safePage - 1))}
            disabled={safePage === 0}
            className="rounded border border-zinc-700 px-4 py-1.5 font-medium text-zinc-200 disabled:opacity-30 hover:border-zinc-400"
          >
            ← Prev
          </button>
          <span className="tabular-nums">
            Page {safePage + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
            disabled={safePage >= pageCount - 1}
            className="rounded border border-zinc-700 px-4 py-1.5 font-medium text-zinc-200 disabled:opacity-30 hover:border-zinc-400"
          >
            Next →
          </button>
        </div>
      </footer>
    </div>
  );
}

function SortHeader({
  label, sortKey, sort, onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; dir: 1 | -1 } | null;
  onSort: (k: SortKey) => void;
}) {
  const active = sort?.key === sortKey;
  return (
    <th className="px-3 py-2.5">
      <button
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 uppercase tracking-wide transition ${
          active ? "text-zinc-100" : "hover:text-zinc-200"
        }`}
      >
        {label}
        <span className="text-[10px]">{active ? (sort.dir === 1 ? "▼" : "▲") : "↕"}</span>
      </button>
    </th>
  );
}

function Row({
  lead, recording, transcribing, onTier, onMic, onNote,
}: {
  lead: Lead;
  recording: boolean;
  transcribing: boolean;
  onTier: (t: Tier) => void;
  onMic: () => void;
  onNote: (n: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const siteDown = lead.websiteStatus && lead.websiteStatus !== "up";

  return (
    <tr className="border-b border-zinc-800/60 align-top hover:bg-zinc-900/50">
      <td className="px-3 py-2.5">
        <div className="font-medium">{lead.name}</div>
        <div className="text-xs text-zinc-500">
          {lead.city ?? "—"}
          {lead.category && lead.category !== "Plumber" && ` · ${lead.category}`}
          {lead.isChain && (
            <span className="ml-1 rounded bg-purple-900 px-1 text-purple-200">chain</span>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-2.5">
        <div>{lead.phone ?? "—"}</div>
        {lead.phoneType && (
          <span
            className={`text-xs ${
              lead.phoneType === "mobile" ? "text-emerald-400" : "text-zinc-500"
            }`}
          >
            {lead.phoneType}
          </span>
        )}
      </td>
      <td className="px-3 py-2.5">
        {lead.website ? (
          <a
            href={lead.website}
            target="_blank"
            rel="noreferrer"
            className={`underline decoration-zinc-600 underline-offset-2 hover:text-white ${
              siteDown ? "text-rose-400" : "text-zinc-300"
            }`}
          >
            {hostname(lead.website)}
            {siteDown && " (down)"}
          </a>
        ) : (
          <span className="font-medium text-emerald-400">none</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-2.5">
        {lead.rating != null ? (
          <span className="text-amber-300">★ {lead.rating.toFixed(1)}</span>
        ) : (
          <span className="text-zinc-600">—</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-2.5">
        <a
          href={reviewsUrl(lead)}
          target="_blank"
          rel="noreferrer"
          className="text-sky-400 underline decoration-sky-800 underline-offset-2 hover:text-sky-200"
        >
          {lead.reviewCount ?? 0} reviews ↗
        </a>
      </td>
      <td className="whitespace-nowrap px-3 py-2.5">
        {lead.photoCount != null ? (
          lead.photoCount
        ) : (
          <span className="text-zinc-600">—</span>
        )}
      </td>
      <td className="px-3 py-2.5">
        {lead.pipelineVerdict === "qualified" ? (
          <span className="text-emerald-400">✓ {lead.pitchAngle ?? ""}</span>
        ) : lead.pipelineVerdict === "rejected" ? (
          <span className="text-zinc-500" title={lead.rejectReason ?? undefined}>
            ✗ {lead.rejectReason?.slice(0, 24) ?? "rejected"}
          </span>
        ) : (
          <span className="text-zinc-500">—</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-2.5">
        <div className="flex gap-1">
          {(["build", "skip", "discuss"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onTier(t)}
              className={`rounded border px-2 py-1 text-xs font-semibold capitalize transition ${
                lead.tier === t
                  ? TIER_STYLE[t]
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </td>
      <td className="min-w-[220px] px-3 py-2.5">
        <div className="flex items-start gap-2">
          <button
            onClick={onMic}
            disabled={transcribing}
            title={recording ? "Stop recording" : "Record why"}
            className={`shrink-0 rounded-full border px-2.5 py-1 text-sm transition ${
              recording
                ? "animate-pulse border-rose-500 bg-rose-600 text-white"
                : "border-zinc-700 hover:border-zinc-400"
            }`}
          >
            {transcribing ? "…" : recording ? "■" : "🎙"}
          </button>
          {editing ? (
            <textarea
              autoFocus
              defaultValue={lead.voiceNote ?? ""}
              onBlur={(e) => {
                setEditing(false);
                if (e.target.value !== (lead.voiceNote ?? "")) onNote(e.target.value);
              }}
              rows={3}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full text-left text-xs text-zinc-400 hover:text-zinc-200"
            >
              {lead.voiceNote ?? <span className="italic text-zinc-600">tap to type</span>}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
