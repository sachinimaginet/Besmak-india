import { query as dbQuery } from './db';

export async function getSetting(id: string, defaultValue: string = ''): Promise<string> {
  try {
    const rows = await dbQuery<any[]>("SELECT value FROM site_settings WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0].value : defaultValue;
  } catch (error) {
    console.error(`Error getting setting ${id}:`, error);
    return defaultValue;
  }
}

export async function updateSetting(id: string, value: string): Promise<void> {
  const now = new Date();
  await dbQuery(
    "INSERT INTO site_settings (id, value, updatedAt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?, updatedAt = ?",
    [id, value, now, value, now]
  );
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const rows = await dbQuery<any[]>("SELECT id, value FROM site_settings");
    return rows.reduce((acc, row) => ({ ...acc, [row.id]: row.value }), {});
  } catch (error) {
    console.error("Error getting all settings:", error);
    return {};
  }
}
