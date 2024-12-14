import { NextResponse } from 'next/server';

export async function GET(req) {
  const secret = process.env.WEBHOOKS_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Not corrct Headers " }, { status: 500 });
  }

  return NextResponse.json({ secret }, { status: 200 });
}
