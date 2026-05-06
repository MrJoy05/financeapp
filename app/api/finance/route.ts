import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { emptyFinanceStore } from "../../finance/types";
import { getDb } from "../../lib/db/client";
import { financeProfiles } from "../../lib/db/schema";
import { normalizeStore } from "../../lib/finance-normalize";
import { verifyNhostAccessToken } from "../../lib/nhost-verify-access";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const userId = await verifyNhostAccessToken(req.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(financeProfiles)
      .where(eq(financeProfiles.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({
        store: emptyFinanceStore,
        updatedAtMs: 0,
      });
    }

    const row = rows[0]!;
    let parsed: unknown;
    try {
      parsed = JSON.parse(row.payload) as unknown;
    } catch {
      parsed = null;
    }
    const store = normalizeStore(parsed, emptyFinanceStore);
    return NextResponse.json({
      store,
      updatedAtMs: row.updatedAtMs,
    });
  } catch (e) {
    console.error("[api/finance GET]", e);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const userId = await verifyNhostAccessToken(req.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawStore =
    body && typeof body === "object" && "store" in body
      ? (body as { store: unknown }).store
      : null;
  const store = normalizeStore(rawStore, emptyFinanceStore);
  const updatedAtMs = Date.now();
  const payload = JSON.stringify(store);

  try {
    const db = getDb();
    await db
      .insert(financeProfiles)
      .values({ userId, payload, updatedAtMs })
      .onConflictDoUpdate({
        target: financeProfiles.userId,
        set: {
          payload: sql`excluded.payload`,
          updatedAtMs: sql`excluded.updated_at_ms`,
        },
      });

    return NextResponse.json({ ok: true, updatedAtMs });
  } catch (e) {
    console.error("[api/finance PUT]", e);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 },
    );
  }
}
