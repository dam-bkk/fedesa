/** Le site lit l'API publique de la plateforme (appfedesa) : résultats publiés, calendrier, records, clubs, tarifs. Revalidation 5 min ; en cas de panne, sections vides mais page servie. */
const BASE = process.env.FEDESA_API ?? "https://appfedesa.damien.asia";
export const APP_URL = process.env.FEDESA_APP_URL ?? "https://appfedesa.damien.asia";

async function get<T>(path: string, fallback: T, revalidate = 300): Promise<T> {
  try {
    const r = await fetch(BASE + path, { next: { revalidate }, headers: { Accept: "application/json" } });
    if (!r.ok) return fallback;
    return (await r.json()) as T;
  } catch { return fallback; }
}
export type Stats = { season: string; licensees: number; women: number; clubs: number; ligues: number; competitionsPublished: number; results: number; byRegion: { code: string; region: string; licensees: number }[] };
export type CalItem = { id: number; code: string; name: string; dateFrom: string; dateTo: string; venue: string; city: string; region: string; regionCode: string; level: string; type: string; status: string; events: string[]; entriesClose: string | null; resultsUrl: string | null };
export type Result = { rank: number | null; athleteId: number; athlete: string; club: string | null; category: string; mark: string; raw: number | null; wind: number | null; points: number; record: string | null };
export type Competition = { id: number; code: string; name: string; dateFrom: string; dateTo: string; venue: string; city: string; region: string; level: string; publishedAt: string | null; events: { eventCode: string; event: string; sex: "M" | "F"; kind: string; results: Result[] }[] };
export type Bilan = { event: string; eventCode: string; sex: string; category: string | null; season: string; items: { rank: number; athleteId: number; athlete: string; club: string | null; category: string; mark: string; raw: number; wind: number | null; points: number; competition: string; competitionId: number; date: string }[] };
export type Record_ = { scope: string; region: string | null; eventCode: string; event: string; sex: "M" | "F"; category: string; mark: string; raw: number; holder: string; club: string | null; venue: string | null; date: string | null };
export type Club = { id: number; code: string; name: string; city: string; region: string; regionCode: string; founded: number | null; president: string | null; phone: string | null; email: string | null; licensees: number; lon: number | null; lat: number | null };
export type Tarifs = { season: string; campaignOpen: boolean; validFrom: string; validTo: string; fees: { code: string; label: string; amount: number; currency: string }[]; documents: { code: string; label: string }[]; howTo: string[] };
export type Athlete = { id: number; name: string; sex: "M" | "F"; category: string; club: string | null; region: string; licensed: boolean; pbs: { eventCode: string; event: string; mark: string; points: number; competition: string; date: string }[]; results: { competitionId: number; competition: string; date: string; event: string; rank: number | null; mark: string }[] };

export const api = {
  stats: () => get<Stats | null>("/api/public/stats", null, 600),
  calendar: () => get<{ items: CalItem[] }>("/api/public/calendrier", { items: [] }),
  season: () => get<{ items: CalItem[] }>("/api/public/calendrier?all=1", { items: [] }),
  competition: (id: number) => get<Competition | { error: string }>(`/api/public/competitions/${id}`, { error: "unavailable" }),
  bilan: (ep: string, sexe: string, cat = "", limit = 10) => get<Bilan | null>(`/api/public/bilans?ep=${ep}&sexe=${sexe}&limit=${limit}${cat ? "&cat=" + cat : ""}`, null),
  records: () => get<{ items: Record_[] }>("/api/public/records", { items: [] }, 3600),
  clubs: () => get<{ count: number; items: Club[] }>("/api/public/clubs", { count: 0, items: [] }, 3600),
  tarifs: () => get<Tarifs | null>("/api/public/tarifs", null, 3600),
  athlete: (id: number) => get<Athlete | null>(`/api/public/athletes/${id}`, null),
};
const M = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const ML = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export const fmtDate = (s?: string | null, long = false) => { if (!s) return "—"; const [y, m, d] = s.slice(0, 10).split("-").map(Number); return long ? `${d} ${ML[m - 1]} ${y}` : `${d} ${M[m - 1]} ${y}`; };
export const dd = (s: string) => s.slice(8, 10);
export const mon = (s: string) => ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"][+s.slice(5, 7) - 1];
export const nf = (n: number) => n.toLocaleString("fr-FR");
