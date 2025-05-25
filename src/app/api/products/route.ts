import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { Supply } from '../../../types/Supply';
import { Dispenser } from '../../../types/Dispenser';

export async function GET() {
  const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
  const DISPENSERS_TAB_GID = process.env.DISPENSERS_TAB_GID;
  const SUPPLIES_TAB_GID = process.env.SUPPLIES_TAB_GID;
  const SUPPLY_IMAGES_TAB_GID = process.env.SUPPLY_IMAGES_TAB_GID;

  if (!SHEET_ID || !DISPENSERS_TAB_GID || !SUPPLIES_TAB_GID || !SUPPLY_IMAGES_TAB_GID) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 400 });
  }

  try {
    const [dispensersSheet, suppliesSheet, supplyImagesSheet] = await Promise.all([
      fetchAndParseInformation(formatCSVURL(SHEET_ID, DISPENSERS_TAB_GID)),
      fetchAndParseInformation(formatCSVURL(SHEET_ID, SUPPLIES_TAB_GID)),
      fetchAndParseInformation(formatCSVURL(SHEET_ID, SUPPLY_IMAGES_TAB_GID)),
    ]);

    const dispensersRaw = dispensersSheet.data;
    const suppliesRaw = suppliesSheet.data;
    const supplyImagesRaw = supplyImagesSheet.data;

    const supplyImagesMap = new Map<string, Record<string, string>>();

    for (const row of supplyImagesRaw) {
      const supplyCode = row.supply_code?.trim();
      const color = row.color?.trim();
      const imageURL = row.imageURL?.trim();
      if (!supplyCode || !color || !imageURL) continue;
      if (!supplyImagesMap.has(supplyCode)) {
        supplyImagesMap.set(supplyCode, {});
      }
      supplyImagesMap.get(supplyCode)![color] = imageURL;
    }

    const suppliesMap = new Map<string, Supply[]>();
    for (const row of suppliesRaw) {
      const dispenserCode = row.dispenser_code?.trim();
      if (!dispenserCode) continue;
      const supply: Supply = {
        code: row.code?.trim(),
        name: row.name?.trim(),
        description: row.description?.trim(),
        quantity: row.quantity?.trim(),
        imageURL: row.imageURL?.trim(),
        imageURLsByColor: supplyImagesMap.get(row.code?.trim()) ||{},
      };
      if (!suppliesMap.has(dispenserCode)) {
        suppliesMap.set(dispenserCode, []);
      }
      suppliesMap.get(dispenserCode)!.push(supply);
    }

    const grouped = new Map<string, Dispenser[]>();
    for (const row of dispensersRaw) {
      const category = row.category?.trim();
      const dispenserCode = row.code?.trim();
      if (!category || !dispenserCode) continue;
      const dispenser: Dispenser = {
        code: dispenserCode,
        name: row.name?.trim(),
        colors: row.colors?.split(',').map((c: string) => c.trim()) || [],
        imageURL: row.imageURL?.trim(),
        supplies: suppliesMap.get(dispenserCode) || [],
        category: category,
      };
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(dispenser);
    }

    // Convert Map to object for JSON response
    const groupedObj = Object.fromEntries(grouped);

    console.log(JSON.stringify(groupedObj))

    return NextResponse.json(groupedObj);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

function formatCSVURL(sheetId: string, gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
async function fetchAndParseInformation(url: string): Promise<any> {
  const res = await fetch(url);
  const text = await res.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed;
}
