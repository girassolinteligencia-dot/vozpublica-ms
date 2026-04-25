import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bloqueios = await prisma.bloqueio.findMany({
      orderBy: { criado_em: 'desc' }
    });
    return NextResponse.json(bloqueios);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { hash, motivo, expira_em } = await req.json();
    const bloqueio = await prisma.bloqueio.create({
      data: { hash, motivo, expira_em: expira_em ? new Date(expira_em) : null }
    });
    return NextResponse.json(bloqueio);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.bloqueio.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
