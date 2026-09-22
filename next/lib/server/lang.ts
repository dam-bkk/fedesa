import "server-only";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/i18n";
export async function getLang(): Promise<Lang> { return (await cookies()).get("lang")?.value === "en" ? "en" : "fr"; }
