"use server";
import { cookies } from "next/headers";
export async function setLang(lang: "fr" | "en") { (await cookies()).set("lang", lang, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 }); }
