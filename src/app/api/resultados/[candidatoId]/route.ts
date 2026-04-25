import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { candidatoId: string } }
) {
  const { candidatoId } = params;

  try {
    const resultados = await prisma.avaliacao.groupBy({
      by: ['atributo_id'],
      where: { candidato_id: candidatoId },
      _sum: { valor: true },
      _count: { _all: true }
    });

    // Fetch attribute names
    const atributos = await prisma.atributo.findMany({
      where: { id: { in: resultados.map(r => r.atributo_id) } }
    });

    const data = resultados.map(r => {
      const attr = atributos.find(a => a.id === r.atributo_id);
      return {
        atributo: attr?.nome || 'Desconhecido',
        valor: r._sum.valor || 0,
        total: r._count._all
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
