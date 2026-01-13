// schema per il testo personalizzabile del footer (singleton)
export default {
  name: "footerSettings",
  title: "Impostazioni Footer",
  type: "document",
  __experimental_actions: ["update", "publish"], // Disabilita create/delete
  fields: [
    {
      name: "customText",
      title: "Testo personalizzato",
      type: "text",
      description:
        "Testo che apparirà nel footer sotto le voci di navigazione (Home, Blog, About). Supporta il ritorno a capo.",
      rows: 4,
      validation: (Rule: any) =>
        Rule.max(500).warning(
          "Il testo è molto lungo, considera di accorciarlo"
        ),
    },
  ],
  preview: {
    select: {
      text: "customText",
    },
    prepare(selection: any) {
      const { text } = selection;
      return {
        title: "Impostazioni Footer",
        subtitle: text
          ? `${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`
          : "Nessun testo personalizzato",
      };
    },
  },
};