import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cidade = searchParams.get('cidade');
  const cargo = searchParams.get('cargo');

  try {
    const candidatos = await prisma.candidato.findMany({
      where: {
        ...(cidade && {
          cidade: {
            equals: cidade,
            mode: 'insensitive'
          }
        }),
        ...(cargo && {
          cargo: {
            equals: cargo,
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
    // Retorna array vazio em vez de erro para o frontend
    return NextResponse.json([], { status: 200 });
  }
}
