import { groq } from "next-sanity";

export const footerSettingsQuery = groq`*[_type == "footerSettings"] | order(_createdAt desc)[0]{
  customText
}`;
