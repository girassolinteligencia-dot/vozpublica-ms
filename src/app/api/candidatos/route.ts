import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campanhaSlug = searchParams.get('campanha');
  const cidade = searchParams.get('cidade');

  try {
    const candidatos = await prisma.candidato.findMany({
      where: {
        ...(campanhaSlug && { campanha: { slug: campanhaSlug } }),
        ...(cidade && { cidade }),
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
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
