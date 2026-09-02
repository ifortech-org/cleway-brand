import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/claudioperroni/Documents/ift/minisiti/cleway-brand/outputs/audit-iubenda-cleway-2026-09-01";
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Audit operativo");
sheet.showGridLines = false;

sheet.mergeCells("A1:J1");
sheet.getRange("A1").values = [["Audit operativo privacy, cookie e accessibilità — cleway.com"]];
sheet.getRange("A1:J1").format = {
  fill: "#070C0E",
  font: { bold: true, color: "#FFFFFF", size: 18 },
  verticalAlignment: "center",
};
sheet.getRange("A1:J1").format.rowHeight = 34;

sheet.mergeCells("A2:J2");
sheet.getRange("A2").values = [["Verifica eseguita il 01/09/2026 sul sito pubblico e sull'implementazione disponibile nel progetto."]];
sheet.getRange("A2:J2").format = {
  fill: "#EAF6F9",
  font: { color: "#24444C", italic: true, size: 10 },
  verticalAlignment: "center",
};
sheet.getRange("A2:J2").format.rowHeight = 24;

sheet.getRange("A3:D3").values = [["Totale voci", "Priorità alta", "Da fare", "Risolte / OK"]];
sheet.getRange("A4:D4").formulas = [[
  "=COUNTA(A7:A18)",
  "=COUNTIF(E7:E18,\"Alta\")",
  "=COUNTIF(D7:D18,\"Da fare\")",
  "=COUNTIF(D7:D18,\"Risolto\")",
]];
sheet.getRange("A3:D3").format = {
  fill: "#2C5963",
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
};
sheet.getRange("A4:D4").format = {
  fill: "#F3F8F9",
  font: { bold: true, color: "#070C0E", size: 15 },
  horizontalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: "#B8CDD2" },
};
sheet.getRange("A3:D4").format.rowHeight = 24;

const rows = [
  [1, "Tasto “Rifiuta tutti” nel cookie banner", "Presente e funzionante; il rifiuto imposta lo stato “Tutti rifiutati”.", "Risolto", "Bassa", "Nessuno", "Nessuna modifica. Conservare il pulsante nelle future revisioni del banner.", "Sviluppo", "https://www.cleway.com/", "Possibile falso positivo o scansione iubenda precedente."],
  [2, "Riapertura delle preferenze cookie", "Il link permanente nel footer apre la pagina completa delle preferenze e mostra lo stato salvato.", "Risolto", "Bassa", "Nessuno", "Nessuna modifica. Mantenere il link “Preferenze Cookie” nel footer.", "Sviluppo", "https://www.cleway.com/cookie-preferences", "Verificato dopo aver selezionato “Rifiuta tutti”."],
  [3, "Registro delle preferenze di consenso", "Scelta e timestamp sono salvati soltanto nel localStorage del browser; non risulta un registro server-side.", "Da fare", "Alta", "Configurazione / integrazione", "Attivare il Consent Database iubenda o un equivalente registro server-side con versione policy, categorie e timestamp.", "Privacy + Sviluppo", "shared/lib/use-cookie-consent.tsx — righe 109-131", "Preferibile usare il servizio iubenda già collegato, evitando un registro custom."],
  [4, "Privacy Policy: reCAPTCHA / hCaptcha", "La Privacy Policy cita Google reCAPTCHA, ma il modulo pubblico usa hCaptcha.", "Da fare", "Alta", "Testo policy", "Sostituire i riferimenti a Google reCAPTCHA con hCaptcha e Intuition Machines, includendo finalità, base giuridica e trasferimenti.", "Privacy / Legale", "https://www.cleway.com/privacy-policy | shared/components/blocks/contactform.tsx — righe 217-220", "La Cookie Policy cita già hCaptcha."],
  [5, "Privacy Policy: servizi e destinatari", "Il sito usa Microsoft 365 SMTP e carica immagini da Sanity CDN; hosting/CDN e altri fornitori effettivi vanno inventariati.", "Da fare", "Alta", "Testo policy", "Aggiungere i fornitori realmente attivi: Microsoft 365, Sanity CDN/CMS e hosting. Includere Resend o YouTube solo se usati sul sito pubblico.", "Privacy / Legale", "app/api/contactform/route.ts — righe 21-33 | https://cdn.sanity.io/", "Confermare anche ruolo privacy, localizzazione e tempi di conservazione di ogni fornitore."],
  [6, "Cookie Policy: elenco e titolare", "La policy non fornisce un inventario granulare completo e indica iFortech SRL, mentre la Privacy Policy indica Cleway SRL.", "Da fare", "Alta", "Testo policy", "Allineare titolare/gestore; documentare cookie e tracker con provider, finalità, durata e categoria. Verificare se ift_session_id esiste ancora.", "Privacy / Legale", "https://www.cleway.com/cookie-policy", "Rimuovere dalla policy cookie non più utilizzati."],
  [7, "Consenso marketing nel modulo di contatto", "La Privacy Policy parla di consenso marketing esplicito, ma nel modulo non è presente una checkbox marketing separata.", "Da fare", "Alta", "Testo / codice", "Se non viene fatto marketing, eliminare la finalità dalla policy. Se viene fatto, aggiungere una checkbox facoltativa, non preselezionata e tracciata.", "Privacy + Sviluppo", "https://www.cleway.com/ | https://www.cleway.com/privacy-policy", "La presa visione della privacy non equivale al consenso marketing."],
  [8, "Termini e Condizioni", "Non risultano acquisti online, abbonamenti, account o pubblicità sul sito.", "Non necessario", "Bassa", "Valutazione legale", "Non introdurli ora. Rivalutare quando il sito venderà corsi/servizi online o creerà account utente.", "Direzione / Legale", "https://www.cleway.com/", "Le condizioni contrattuali B2B possono restare nel processo commerciale offline."],
  [9, "Accessibility Widget", "Nessun widget di accessibilità è visibile sul sito.", "Da valutare", "Media", "Accessibilità / codice", "Eseguire prima un audit WCAG e correggere i problemi reali. Valutare un widget solo come supporto, non come sostituto delle correzioni.", "Sviluppo + UX", "https://www.cleway.com/ | https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en", "Il sito non appare attualmente un e-commerce."],
  [10, "Contrasto del testo", "La criticità non è stata riprodotta: il rapporto più basso misurato sul testo statico è circa 6,71:1.", "Da verificare", "Bassa", "Test / accessibilità", "Ripetere un audit WCAG completo ai breakpoint mobile e desktop dopo ogni cambio grafico; nessuna correzione colore urgente rilevata.", "Sviluppo + UX", "https://www.w3.org/TR/WCAG22/#contrast-minimum", "Soglia WCAG AA: 4,5:1 per testo normale e 3:1 per testo grande."],
  [11, "Link footer “About”", "Il link /about restituisce una pagina 404.", "Da fare", "Media", "Codice / contenuto", "Correggere l'URL del link oppure pubblicare la pagina About.", "Sviluppo / Contenuti", "https://www.cleway.com/about", "Problema extra rilevato durante l'audit."],
  [12, "Link verso dominio di staging", "Tre schede servizi puntano ancora a cleway-brand.vercel.app invece del dominio cleway.com.", "Da fare", "Media", "Testo / CMS", "Aggiornare i tre collegamenti nel CMS verso le rispettive pagine sul dominio principale.", "Contenuti / CMS", "https://cleway-brand.vercel.app/", "Riguarda Compliance & Governance e le due aree Formazione."],
];

sheet.getRange("A6:J18").values = [[
  "ID",
  "Punto / rilievo",
  "Esito audit",
  "Stato operativo",
  "Priorità",
  "Tipo intervento",
  "Azione consigliata",
  "Responsabile suggerito",
  "Evidenza / fonte",
  "Note",
], ...rows];

const table = sheet.tables.add("A6:J18", true, "AuditOperativoTable");
table.style = "TableStyleMedium2";
table.showFilterButton = true;

sheet.getRange("A6:J6").format = {
  fill: "#0B7B95",
  font: { bold: true, color: "#FFFFFF" },
  verticalAlignment: "center",
  wrapText: true,
};
sheet.getRange("A7:J18").format = {
  verticalAlignment: "top",
  wrapText: true,
  borders: { insideHorizontal: { style: "thin", color: "#D7E3E6" } },
};
sheet.getRange("A7:A18").format.horizontalAlignment = "center";
sheet.getRange("D7:F18").format.horizontalAlignment = "center";
sheet.getRange("A6:J6").format.rowHeight = 34;
sheet.getRange("A7:J18").format.rowHeight = 66;

sheet.getRange("A:A").format.columnWidth = 6;
sheet.getRange("B:B").format.columnWidth = 31;
sheet.getRange("C:C").format.columnWidth = 34;
sheet.getRange("D:D").format.columnWidth = 18;
sheet.getRange("E:E").format.columnWidth = 12;
sheet.getRange("F:F").format.columnWidth = 22;
sheet.getRange("G:G").format.columnWidth = 46;
sheet.getRange("H:H").format.columnWidth = 22;
sheet.getRange("I:I").format.columnWidth = 47;
sheet.getRange("J:J").format.columnWidth = 34;

sheet.getRange("D7:D18").dataValidation = { rule: { type: "list", values: ["Da fare", "Da valutare", "Da verificare", "Risolto", "Non necessario"] } };
sheet.getRange("E7:E18").dataValidation = { rule: { type: "list", values: ["Alta", "Media", "Bassa"] } };

sheet.getRange("E7:E18").conditionalFormats.add("containsText", { text: "Alta", format: { fill: "#FDE8E7", font: { bold: true, color: "#A61B1B" } } });
sheet.getRange("E7:E18").conditionalFormats.add("containsText", { text: "Media", format: { fill: "#FFF3CD", font: { bold: true, color: "#7A4D00" } } });
sheet.getRange("E7:E18").conditionalFormats.add("containsText", { text: "Bassa", format: { fill: "#E6F4EA", font: { bold: true, color: "#236B3B" } } });
sheet.getRange("D7:D18").conditionalFormats.add("containsText", { text: "Da fare", format: { fill: "#FDE8E7", font: { color: "#A61B1B" } } });
sheet.getRange("D7:D18").conditionalFormats.add("containsText", { text: "Risolto", format: { fill: "#E6F4EA", font: { color: "#236B3B" } } });

sheet.freezePanes.freezeRows(6);

const inspect = await workbook.inspect({
  kind: "table",
  range: "Audit operativo!A1:J18",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 10,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "Audit operativo",
  range: "A1:J18",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}/audit-operativo-cleway.xlsx`);
