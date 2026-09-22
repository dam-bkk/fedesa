/** Contenu éditorial du site : issu de fedesa.sn (relevé du 22/09/2026) et de la documentation fédérale. Les articles marqués `demo` sont illustratifs. */
export const CONTACT = { venue: "Stade Iba Mar Diop", street: "Rue M'baye Worre", city: "Dakar", phone: "+221 33 821 77 98", email: "contact@fedesa.com", hours: "Lundi – vendredi, 8 h – 13 h" };
export const BUREAU = [
  { role: "Président", name: "Sara Oualy" }, { role: "Vice-président", name: "Bara Thiam" }, { role: "Directeur administratif", name: "Jean Gomis" },
  { role: "Secrétaire général", name: "—" }, { role: "Trésorier général", name: "—" }, { role: "Directeur technique national", name: "—" },
];
export const LIGUES: { code: string; name: string; venue: string; bureau: boolean }[] = [
  ["DK", "Dakar", "Stade Iba Mar Diop", true], ["TH", "Thiès", "Stade Lat Dior", false], ["DB", "Diourbel", "Stade Ely Manel Fall", true], ["FK", "Fatick", "Stade Massène Sène", true],
  ["KL", "Kaolack", "Stade Lamine Guèye", true], ["KF", "Kaffrine", "Stade municipal de Kaffrine", true], ["KD", "Kolda", "Stade régional de Kolda", true], ["LG", "Louga", "Stade Alboury Ndiaye", false],
  ["MT", "Matam", "Stade régional de Matam", false], ["SL", "Saint-Louis", "Stade Me Babacar Sèye", false], ["SE", "Sédhiou", "Stade municipal de Sédhiou", false], ["TC", "Tambacounda", "Stade régional de Tambacounda", false],
  ["KE", "Kédougou", "Stade municipal de Kédougou", true], ["ZG", "Ziguinchor", "Stade Aline Sitoé Diatta", false],
].map(([code, name, venue, bureau]) => ({ code: code as string, name: name as string, venue: venue as string, bureau: bureau as boolean }));
export const HISTOIRE = [
  { y: "1960", t: "Fondation de la fédération", d: "L'athlétisme sénégalais se structure au lendemain de l'indépendance, autour du Stade Iba Mar Diop." },
  { y: "1988", t: "Amadou Dia Ba, argent olympique", d: "47''23 sur 400 m haies à Séoul — la première médaille olympique de l'athlétisme sénégalais." },
  { y: "2001", t: "Amy Mbacké Thiam championne du monde", d: "49''86 sur 400 m à Edmonton, toujours record du Sénégal." },
  { y: "2009", t: "Ndiss Kaba Badji, 17,07 m", d: "Le triple saut sénégalais au sommet du continent." },
  { y: "2023", t: "Jeux de la Francophonie, Kinshasa", d: "Or de Louis François Mendy au 110 m haies, argent du 4 × 100 m, record national égalé par Mamadou Fall Sarr." },
  { y: "2027", t: "Championnats d'Afrique à Dakar", d: "Le grand rendez-vous continental sur la piste du stade Abdoulaye Wade de Diamniadio." },
];
export const PARTENAIRES = { institutional: ["Ministère des Sports", "CNOSS", "World Athletics", "CAA — Confédération Africaine d'Athlétisme"], sponsors: ["Orange", "Sonatel", "Eiffage Sénégal", "Kirène"] };
export type Post = { slug: string; date: string; cat: "Compétition" | "Sélection" | "Formation" | "Fédération"; title: string; excerpt: string; img: string; body: string[]; demo?: boolean };
export const POSTS: Post[] = [
  { slug: "mendy-or-110m-haies-kinshasa", date: "2023-08-02", cat: "Sélection", title: "Louis François Mendy en or sur 110 m haies aux Jeux de la Francophonie", excerpt: "À Kinshasa, le hurdler sénégalais s'impose en finale et offre au Sénégal son titre le plus marquant de la saison.", img: "/img/news-1.avif", body: ["Louis François Mendy a remporté la finale du 110 m haies des IXes Jeux de la Francophonie à Kinshasa. Une victoire nette, construite sur un départ rapide et un franchissement impeccable des dernières haies.", "La délégation sénégalaise a également décroché l'argent du relais 4 × 100 m, tandis que Mamadou Fall Sarr égalait le record national de la hauteur.", "La fédération félicite les athlètes, l'encadrement technique et les clubs formateurs."] },
  { slug: "argent-4x100-kinshasa", date: "2023-08-02", cat: "Sélection", title: "Le 4 × 100 m sénégalais décroche l'argent à Kinshasa", excerpt: "Une transmission propre et une dernière ligne droite tenue : le relais monte sur la deuxième marche du podium.", img: "/img/news-3.avif", body: ["Le quatuor sénégalais a signé la deuxième performance de la finale du relais 4 × 100 m, confirmant la profondeur du sprint national.", "Ce podium récompense le travail collectif engagé sur les transmissions depuis le stage de préparation de Diamniadio."] },
  { slug: "fall-sarr-record-hauteur", date: "2023-08-02", cat: "Compétition", title: "Mamadou Fall Sarr égale le record national de la hauteur", excerpt: "Le sauteur du Sénégal franchit la barre du record à Kinshasa, en finale des Jeux de la Francophonie.", img: "/img/news-2.avif", body: ["En finale du saut en hauteur, Mamadou Fall Sarr a égalé le record du Sénégal, au terme d'un concours serré.", "La performance a été transmise à la commission des records pour homologation."] },
  { slug: "championnats-nationaux-diamniadio", date: "2023-08-11", cat: "Compétition", title: "Championnats nationaux : trois jours de finales à Diamniadio", excerpt: "Les 11, 12 et 13 août, l'élite nationale se retrouve au stade de Diamniadio pour les titres 2023.", img: "/img/news-4.avif", body: ["Les championnats nationaux réunissent les meilleurs athlètes des 14 ligues sur trois journées de compétition.", "Le programme complet, les horaires et les résultats sont publiés sur la plateforme fédérale au fil des finales."] },
  { slug: "10-km-saint-louis", date: "2023-02-25", cat: "Compétition", title: "10 km de Saint-Louis : la 10e édition sur la place Faidherbe", excerpt: "Course sur route ouverte à tous, labellisée par la fédération, au cœur de la ville historique.", img: "/img/blocks.avif", body: ["La 10e édition des 10 km de Saint-Louis s'est courue depuis la place Faidherbe, avec un plateau élite et une course populaire.", "L'épreuve est inscrite au calendrier fédéral des courses sur route."] },
  { slug: "visite-onads", date: "2023-03-13", cat: "Fédération", title: "Lutte antidopage : la fédération reçoit l'ONADS", excerpt: "Visite de travail du Dr Mouhamed Diop, au siège fédéral, sur le programme de prévention 2023.", img: "/img/clubs.avif", body: ["La fédération a reçu l'Organisation nationale antidopage du Sénégal pour préparer le programme de sensibilisation des athlètes et des encadrants.", "Des sessions de formation seront organisées dans les ligues."] },
];
export const GALERIE = [
  { src: "/img/news-1.avif", alt: "Finale de sprint au stade", cap: "Championnats nationaux — finale du 100 m" },
  { src: "/img/hero-start.avif", alt: "Sprinteuses dans les starting-blocks", cap: "Départ du 100 m femmes" },
  { src: "/img/blocks.avif", alt: "Starting-blocks", cap: "Avant le départ" },
  { src: "/img/news-2.avif", alt: "Séance de détection sur piste", cap: "Détection régionale — Thiès" },
  { src: "/img/news-3.avif", alt: "Supporters dans les tribunes", cap: "Tribunes du stade Iba Mar Diop" },
  { src: "/img/news-4.avif", alt: "Coureurs à l'entraînement au crépuscule", cap: "Entraînement — corniche de Dakar" },
  { src: "/img/clubs.avif", alt: "Piste d'un stade régional", cap: "Stade régional" },
];

/** « Dans le monde » : Sénégalais sur les grands rendez-vous internationaux — faits publics (podiums olympiques, mondiaux, continentaux, Francophonie). */
export const MONDE: { year: string; city: string; meet: string; athlete: string; event: string; mark: string; medal?: "or" | "argent" | "bronze"; note: string }[] = [
  { year: "1988", city: "Séoul", meet: "Jeux olympiques", athlete: "Amadou Dia Ba", event: "400 m haies", mark: "47''23", medal: "argent", note: "Première médaille olympique de l'athlétisme sénégalais, toujours record national." },
  { year: "2001", city: "Edmonton", meet: "Championnats du monde", athlete: "Amy Mbacké Thiam", event: "400 m", mark: "49''86", medal: "or", note: "Championne du monde — le record du Sénégal tient depuis." },
  { year: "2007", city: "Alger", meet: "Jeux africains", athlete: "Ndiss Kaba Badji", event: "Longueur", mark: "8m46", medal: "or", note: "Record national de la longueur." },
  { year: "2009", city: "Dakar", meet: "Meeting international", athlete: "Ndiss Kaba Badji", event: "Triple saut", mark: "17m07", note: "Record national du triple saut, devant son public." },
  { year: "2023", city: "Kinshasa", meet: "Jeux de la Francophonie", athlete: "Louis François Mendy", event: "110 m haies", mark: "13''33", medal: "or", note: "Titre francophone et record national." },
  { year: "2023", city: "Kinshasa", meet: "Jeux de la Francophonie", athlete: "Relais 4 × 100 m", event: "4 × 100 m", mark: "—", medal: "argent", note: "Deuxième marche du podium pour le relais sénégalais." },
  { year: "2023", city: "Kinshasa", meet: "Jeux de la Francophonie", athlete: "Mamadou Fall Sarr", event: "Hauteur", mark: "2m26", note: "Record national égalé en finale." },
  { year: "2027", city: "Dakar", meet: "Championnats d'Afrique", athlete: "Équipe du Sénégal", event: "Toutes épreuves", mark: "à écrire", note: "Le prochain chapitre, à domicile — 12 au 16 mai 2027." },
];
