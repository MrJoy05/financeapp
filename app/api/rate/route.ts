import { NextResponse } from "next/server";

type FrankfurterLatest = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

export async function GET() {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=MXN",
      { next: { revalidate: 300 } },
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "upstream_error" },
        { status: 502 },
      );
    }
    const data = (await res.json()) as FrankfurterLatest;
    const mxn = data.rates.MXN;
    if (typeof mxn !== "number") {
      return NextResponse.json({ error: "invalid_payload" }, { status: 502 });
    }
    return NextResponse.json({
      rate: mxn,
      date: data.date,
      base: data.base,
    });
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
