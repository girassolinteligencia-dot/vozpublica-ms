import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const evaluations = await prisma.avaliacao.findMany({
      take: 10,
      orderBy: { criado_em: 'desc' },
      include: {
        candidato: { select: { nome: true } },
        atributo: { select: { nome: true } }
      }
    });

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
