import { getStore } from "@netlify/blobs";
import { verify } from "./_auth.mjs";
export const config = { path: "/api/data" };
export default async (req) => {
  const store = getStore("sahy");
  if (req.method === "GET") {
    const d = await store.get("data", { type: "json" });
    return new Response(JSON.stringify(d || null), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  if (req.method === "PUT") {
    const tok = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
    if (!verify(tok)) return Response.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
    let d; try { d = await req.json(); } catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }
    if (!d || !Array.isArray(d.lots) || d.lots.length > 1000) return Response.json({ error: "Dados inválidos" }, { status: 400 });
    // guarda a versão anterior como backup
    const prev = await store.get("data", { type: "json" });
    if (prev) await store.setJSON("backup", prev);
    d.updated = new Date().toISOString();
    await store.setJSON("data", d);
    return Response.json({ ok: true, updated: d.updated });
  }
  return new Response("", { status: 405 });
};
