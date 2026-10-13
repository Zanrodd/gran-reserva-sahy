import { createHmac, timingSafeEqual } from "node:crypto";
const key = () => process.env.SESSION_SECRET || ("k:" + (process.env.ADMIN_PASSWORD || ""));
export const sign = (exp) => exp + "." + createHmac("sha256", key()).update(String(exp)).digest("hex");
export function verify(tok) {
  if (!tok || !process.env.ADMIN_PASSWORD) return false;
  const [exp, mac] = String(tok).split(".");
  if (!exp || !mac || Number(exp) < Date.now()) return false;
  const good = sign(exp).split(".")[1];
  const a = Buffer.from(mac), b = Buffer.from(good);
  return a.length === b.length && timingSafeEqual(a, b);
}
export const safeEq = (x, y) => {
  const a = Buffer.from(String(x)), b = Buffer.from(String(y));
  return a.length === b.length && timingSafeEqual(a, b);
};
