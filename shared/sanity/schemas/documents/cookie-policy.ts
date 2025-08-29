import { defineField, defineType } from "sanity";

export default defineType({
  name: "cookiePolicy",
  title: "Cookie Policy",
  type: "document",
  icon: () => "🍪",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Contenuto",
      type: "block-content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Ultimo aggiornamento",
      type: "datetime",
      validation: (rule) => rule.required(),
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
        title: title || "Cookie Policy",
        subtitle: lastUpdated
          ? `Aggiornata il ${new Date(lastUpdated).toLocaleDateString("it-IT")}`
          : "Nessuna data",
      };
    },
  },
});
