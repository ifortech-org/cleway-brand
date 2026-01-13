import { client } from "../lib/client";
import { footerSettingsQuery } from "../queries/footerSettings";

export async function fetchFooterSettings() {
  return await client.fetch(footerSettingsQuery);
}
