import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET campanhas for admin with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const where = search
      ? {
          nome: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [campanhas, total] = await Promise.all([
      prisma.campanha.findMany({
        where,
        include: {
          _count: {
            select: { candidatos: true, atributos: true },
          },
        },
        orderBy: { data_inicio: 'desc' },
        take: limit,
        skip,
      }),
      prisma.campanha.count({ where }),
    ]);

    return NextResponse.json({
      data: campanhas,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Erro ao buscar campanhas admin:', error);
    return NextResponse.json(
      { data: [], total: 0, page: 1, totalPages: 0 },
      { status: 200 }
    );
  }
}

// POST create a new campanha
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, slug, status, data_fim, meta_config } = body;

    if (!nome || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }

    const campanha = await prisma.campanha.create({
      data: {
        nome,
        slug,
        status: status || 'ativo',
        data_fim: data_fim ? new Date(data_fim) : null,
        meta_config: meta_config || null,
      },
    });

    return NextResponse.json(campanha);
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    return NextResponse.json(
      { error: 'Erro interno ao criar campanha' },
      { status: 500 }
    );
  }
}

// PATCH update a campanha
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (updateData.data_fim) {
      updateData.data_fim = new Date(updateData.data_fim);
    }

    const campanha = await prisma.campanha.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(campanha);
  } catch (error) {
    console.error('Erro ao atualizar campanha:', error);
    return NextResponse.json(
      { error: 'Erro interno ao atualizar campanha' },
      { status: 500 }
    );
  }
}
