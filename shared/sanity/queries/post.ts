import { groq } from "next-sanity";

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug && (coalesce(language, "it") == $language)][0]{
  title,
  slug,
  image{
    ...,
    asset->{
    _id,
    url,
    mimeType,
    metadata {
      lqip,
      dimensions {
      width,
      height
      }
    }
    },
    alt
  },
  body[]{
    ...,
    _type == "image" => {
    ...,
    asset->{
      _id,
      url,
      mimeType,
      metadata {
      lqip,
      dimensions {
        width,
        height
      }
      }
    }
    }
  },
  author->{
    name,
    image {
    ...,
    asset->{
      _id,
      url,
      mimeType,
      metadata {
      lqip,
      dimensions {
        width,
        height
      }
      }
    },
    alt
    }
  },
  categories[]->{
    _id,
    title,
    slug
  },
  _createdAt,
  _updatedAt,
  meta_title,
  meta_description,
  noindex,
  ogImage {
    asset->{
    _id,
    url,
    metadata {
      dimensions {
      width,
      height
      }
    }
    },
  }
}`;

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug) && (coalesce(language, "it") == $language)] | order(_createdAt desc){
  title,
  slug,
  excerpt,
  image{
    asset->{
    _id,
    url,
    mimeType,
    metadata {
      lqip,
      dimensions {
      width,
      height
      }
    }
    },
    alt
  },
  categories[]->{
    _id,
    title,
    slug
  },
}`;

export const POSTS_SLUGS_QUERY = groq`*[_type == "post" && defined(slug) && (coalesce(language, "it") == $language)]{slug}`;
