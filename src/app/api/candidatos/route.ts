import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  try {
    // Buscar ano ativo nos parâmetros da plataforma
    const paramAno = await prisma.parametroPlataforma.findUnique({
      where: { chave: 'geral_ano_pleito' }
    });
    const anoAtivo = paramAno ? (paramAno.valor as number) : 2024;

    const candidatos = await prisma.candidato.findMany({
      where: {
        ano_eleicao: anoAtivo,
        ...(search && {
          nome: {
            contains: search,
            mode: 'insensitive'
          }
        }),
      },
      include: {
        campanha: {
          include: {
            atributos: {
              include: {
                atributo: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(candidatos);
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    return NextResponse.json([], { status: 200 });
  }
}
