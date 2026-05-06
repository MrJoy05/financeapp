import { NextRequest, NextResponse } from "next/server";

type QuoteResult = {
  symbol: string;
  price: number | null;
  currency: string | null;
  shortName?: string | null;
  exchange?: string | null;
  error?: string;
};

async function yahooQuote(symbol: string): Promise<QuoteResult> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol.trim(),
    )}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (compatible; NimbusFinanceQuotes/1.0; +https://nimbus.local)",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return {
        symbol,
        price: null,
        currency: null,
        error: `upstream_${res.status}`,
      };
    }
    const payload = (await res.json()) as {
      chart?: { result?: { meta?: Record<string, unknown> }[]; error?: { description?: string } };
    };
    const meta = payload?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta !== "object") {
      return {
        symbol,
        price: null,
        currency: null,
        error: "invalid_payload",
      };
    }
    const priceRaw =
      (meta.regularMarketPrice as number | undefined) ??
      (meta.previousClose as number | undefined) ??
      null;
    const currency = (meta.currency as string | undefined) ?? null;
    const shortName = (meta.shortName ?? meta.symbol) as string | undefined;

    const region = /^.*\.MX$/i.test(symbol) ? "BMV listing (Yahoo suffix .MX)" : "US equity";

    return {
      symbol,
      price: typeof priceRaw === "number" && Number.isFinite(priceRaw) ? priceRaw : null,
      currency,
      shortName: shortName ?? null,
      exchange: region,
    };
  } catch {
    return { symbol, price: null, currency: null, error: "fetch_failed" };
  }
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("symbols") ?? "";
  const symbols = [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))];

  if (!symbols.length) {
    return NextResponse.json({ error: "missing_symbols" }, { status: 400 });
  }
  if (symbols.length > 24) {
    return NextResponse.json({ error: "too_many_symbols" }, { status: 400 });
  }

  const quotes = await Promise.all(symbols.map((s) => yahooQuote(s)));

  return NextResponse.json({
    source: "yahoo_chart_v8",
    disclaimer:
      "Precios de referencia vía Yahoo Finance; pueden retrasarse. No es asesoría financiera.",
    quotes,
    fetchedAt: new Date().toISOString(),
  });
}
