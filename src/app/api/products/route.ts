import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function GET() {
  const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

  try {
    const res = await fetch(CSV_URL);
    const text = await res.text();

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const grouped = parsed.data.reduce((acc: any, product: any) => {
      if (!product.category) return acc;
      const cat = product.category.trim();
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {});

    return NextResponse.json(grouped);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}