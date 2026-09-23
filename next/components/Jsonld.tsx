import { CONTACT } from "@/lib/content";
const BASE = "https://fedesa.damien.asia";

/** Données structurées : l'organisation sportive et le site, pour les moteurs de recherche. */
export function OrgJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsOrganization", "@id": `${BASE}/#organisation`,
        name: "Fédération Sénégalaise d'Athlétisme", alternateName: "FEDESA", sport: "Athletics", url: BASE, logo: `${BASE}/icon.svg`,
        foundingDate: "1960", areaServed: { "@type": "Country", name: "Sénégal" },
        address: { "@type": "PostalAddress", streetAddress: `${CONTACT.venue}, ${CONTACT.street}`, addressLocality: CONTACT.city, addressCountry: "SN" },
        telephone: CONTACT.phone, email: CONTACT.email,
        memberOf: [{ "@type": "SportsOrganization", name: "World Athletics" }, { "@type": "SportsOrganization", name: "Confédération Africaine d'Athlétisme" }],
      },
      { "@type": "WebSite", "@id": `${BASE}/#site`, url: BASE, name: "FEDESA", inLanguage: ["fr", "en"], publisher: { "@id": `${BASE}/#organisation` } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** Une compétition publiée : SportsEvent. */
export function EventJsonLd({ c }: { c: { id: number; name: string; dateFrom: string; dateTo: string; venue: string; city: string } }) {
  const data = {
    "@context": "https://schema.org", "@type": "SportsEvent", name: c.name, startDate: c.dateFrom, endDate: c.dateTo,
    eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: c.venue, address: { "@type": "PostalAddress", addressLocality: c.city, addressCountry: "SN" } },
    organizer: { "@type": "SportsOrganization", name: "Fédération Sénégalaise d'Athlétisme", url: BASE },
    url: `${BASE}/competitions/${c.id}`,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
