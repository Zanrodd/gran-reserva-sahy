import { sign, safeEq } from "./_auth.mjs";
export const config = { path: "/api/login" };
export default async (req) => {
  if (req.method !== "POST") return new Response("", { status: 405 });
  const U = process.env.ADMIN_USER || "admin", P = process.env.ADMIN_PASSWORD;
  if (!P) return Response.json({ error: "ADMIN_PASSWORD não configurada no Netlify." }, { status: 500 });
  let b = {}; try { b = await req.json(); } catch {}
  await new Promise(r => setTimeout(r, 700)); // freia tentativa em massa
  const ok = safeEq(String(b.user || "").toLowerCase(), U.toLowerCase()) & safeEq(b.password || "", P);
  if (!ok) return Response.json({ error: "Usuário ou senha incorretos." }, { status: 401 });
  return Response.json({ token: sign(Date.now() + 12 * 3600 * 1000) });
};
