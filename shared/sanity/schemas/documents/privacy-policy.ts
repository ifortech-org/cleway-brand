import { defineField, defineType } from "sanity";

export default defineType({
  name: "privacyPolicy",
  title: "Privacy Policy",
  type: "document",
  icon: () => "🔒",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Titolo (EN)",
      type: "string",
      description: "Titolo della privacy policy in inglese",
    }),
    defineField({
      name: "content",
      title: "Contenuto",
      type: "block-content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contentEn",
      title: "Contenuto (EN)",
      type: "block-content",
      description: "Contenuto della privacy policy in inglese",
    }),
    defineField({
      name: "lastUpdated",
      title: "Ultimo aggiornamento",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdatedEn",
      title: "Ultimo aggiornamento (EN)",
      type: "datetime",
      description: "Data ultimo aggiornamento della versione inglese",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      lastUpdated: "lastUpdated",
    },
    prepare({ title, lastUpdated }) {
      return {
        title: title || "Privacy Policy",
        subtitle: lastUpdated
          ? `Aggiornata il ${new Date(lastUpdated).toLocaleDateString("it-IT")}`
          : "Nessuna data",
      };
    },
  },
});
