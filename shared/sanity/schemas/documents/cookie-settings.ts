import { defineField, defineType } from "sanity";

export default defineType({
  name: "cookieSettings",
  title: "Impostazioni Cookie",
  type: "document",
  icon: () => "🍪",
  fields: [
    defineField({
      name: "title",
      title: "Titolo del banner",
      type: "string",
      initialValue: "Questo sito utilizza i cookie",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descrizione",
      type: "text",
      rows: 3,
      initialValue:
        "Utilizziamo i cookie per migliorare la tua esperienza di navigazione e per fornire contenuti personalizzati. Continuando a navigare accetti l'uso dei cookie.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "acceptAllText",
      title: "Testo pulsante 'Accetta tutti'",
      type: "string",
      initialValue: "Accetta tutti",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rejectAllText",
      title: "Testo pulsante 'Rifiuta tutti'",
      type: "string",
      initialValue: "Rifiuta tutti",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customizeText",
      title: "Testo pulsante 'Personalizza'",
      type: "string",
      initialValue: "Personalizza",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "privacyPolicyText",
      title: "Testo link Privacy Policy",
      type: "string",
      initialValue: "Leggi la Privacy Policy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cookiePolicyText",
      title: "Testo link Cookie Policy",
      type: "string",
      initialValue: "Leggi la Cookie Policy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      title: "Posizione del banner",
      type: "string",
      options: {
        list: [
          { title: "In basso", value: "bottom" },
          { title: "In alto", value: "top" },
          { title: "Al centro (modale)", value: "center" },
        ],
      },
      initialValue: "bottom",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showRejectButton",
      title: "Mostra pulsante 'Rifiuta tutti'",
      type: "boolean",
      initialValue: true,
      description: "Richiesto per conformità GDPR in EU",
    }),
    defineField({
      name: "showCustomizeButton",
      title: "Mostra pulsante 'Personalizza'",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "cookieCategories",
      title: "Categorie Cookie",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "id",
              title: "ID Categoria",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "name",
              title: "Nome",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "description",
              title: "Descrizione",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            },
            {
              name: "required",
              title: "Obbligatori",
              type: "boolean",
              initialValue: false,
              description:
                "I cookie obbligatori non possono essere disabilitati",
            },
            {
              name: "defaultEnabled",
              title: "Abilitati per default",
              type: "boolean",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "description",
              required: "required",
            },
            prepare({ title, subtitle, required }) {
              return {
                title: `${title} ${required ? "(Obbligatori)" : ""}`,
                subtitle,
              };
            },
          },
        },
      ],
      initialValue: [
        {
          id: "necessary",
          name: "Cookie Necessari",
          description:
            "Questi cookie sono essenziali per il funzionamento del sito web.",
          required: true,
          defaultEnabled: true,
        },
        {
          id: "analytics",
          name: "Cookie Analytics",
          description:
            "Ci aiutano a capire come i visitatori interagiscono con il sito web.",
          required: false,
          defaultEnabled: false,
        },
        {
          id: "marketing",
          name: "Cookie Marketing",
          description:
            "Utilizzati per tracciare i visitatori sui siti web per mostrare annunci pertinenti.",
          required: false,
          defaultEnabled: false,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      position: "position",
    },
    prepare({ title, position }) {
      return {
        title: title || "Impostazioni Cookie",
        subtitle: `Posizione: ${position || "bottom"}`,
      };
    },
  },
});
