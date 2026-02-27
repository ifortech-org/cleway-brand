import { groq } from "next-sanity";

export const PRIVACY_POLICY_QUERY = groq`
  *[_type == "privacyPolicy" && _id == "privacyPolicySingleton"][0] {
    _id,
    "title": select($language == "en" && defined(titleEn) => titleEn, title),
    "content": select($language == "en" && defined(contentEn) => contentEn, content),
    "lastUpdated": select($language == "en" && defined(lastUpdatedEn) => lastUpdatedEn, lastUpdated),
    seo {
      title,
      description,
      keywords,
      image {
        asset-> {
          url,
          metadata {
            dimensions
          }
        }
      },
      robots
    }
  }
`;

export const COOKIE_POLICY_QUERY = groq`
  *[_type == "cookiePolicy" && _id == "cookiePolicySingleton"][0] {
    _id,
    "title": select($language == "en" && defined(titleEn) => titleEn, title),
    "content": select($language == "en" && defined(contentEn) => contentEn, content),
    "lastUpdated": select($language == "en" && defined(lastUpdatedEn) => lastUpdatedEn, lastUpdated),
    seo {
      title,
      description,
      keywords,
      image {
        asset-> {
          url,
          metadata {
            dimensions
          }
        }
      },
      robots
    }
  }
`;

export const COOKIE_SETTINGS_QUERY = groq`
  *[_type == "cookieSettings" && _id == "cookieSettingsSingleton"][0] {
    _id,
    title,
    description,
    acceptAllText,
    rejectAllText,
    customizeText,
    privacyPolicyText,
    cookiePolicyText,
    position,
    showRejectButton,
    showCustomizeButton,
    cookieCategories[] {
      id,
      name,
      description,
      required,
      defaultEnabled
    }
  }
`;
