import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type FreeGenerationStatus = "training" | "generating" | "completed" | "failed";

export type FreeGeneration = {
  email: string;
  requestId: string;
  status: FreeGenerationStatus;
  createdAt: string;
  updatedAt: string;
  style?: string;
  loraPath?: string;
  imageUrl?: string;
  imageUrls?: string[];
  error?: string;
};

export type WaitlistEntry = {
  email: string;
  date: string;
};

const DATA_DIR = "/tmp";
const GENERATIONS_PATH = path.join(DATA_DIR, "generations.json");
const WAITLIST_PATH = path.join(DATA_DIR, "waitlist.json");

async function readJsonArray<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeJsonArray<T>(filePath: string, rows: T[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

export async function readWaitlist(): Promise<WaitlistEntry[]> {
  return readJsonArray<WaitlistEntry>(WAITLIST_PATH);
}

export async function readGenerations(): Promise<FreeGeneration[]> {
  return readJsonArray<FreeGeneration>(GENERATIONS_PATH);
}

export async function saveGenerations(rows: FreeGeneration[]) {
  await writeJsonArray(GENERATIONS_PATH, rows);
}

export async function upsertGeneration(next: FreeGeneration) {
  const rows = await readGenerations();
  const idx = rows.findIndex((row) => row.requestId === next.requestId);
  if (idx >= 0) {
    rows[idx] = next;
  } else {
    rows.push(next);
  }
  await saveGenerations(rows);
  return next;
}

export async function updateGeneration(
  requestId: string,
  patch: Partial<Omit<FreeGeneration, "requestId" | "email" | "createdAt">>
): Promise<FreeGeneration | null> {
  const rows = await readGenerations();
  const idx = rows.findIndex((row) => row.requestId === requestId);
  if (idx < 0) return null;
  const next = {
    ...rows[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  rows[idx] = next;
  await saveGenerations(rows);
  return next;
}
