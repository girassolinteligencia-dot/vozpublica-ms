import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, subDays } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dias = parseInt(searchParams.get('dias') || '30');
    const startDate = subDays(new Date(), dias);

    // 1. Ranking Líquido (Candidato x Sentimento)
    const rankingRaw = await prisma.avaliacao.groupBy({
      by: ['candidato_id'],
      _sum: { valor: true },
      _count: { _all: true },
      where: { criado_em: { gte: startDate }, is_valid: true }
    });

    const candidatos = await prisma.candidato.findMany({
      select: { id: true, nome: true, cargo: true, partido: true }
    });

    const ranking = rankingRaw.map(r => {
      const cand = candidatos.find(c => c.id === r.candidato_id);
      return {
        nome: cand?.nome || 'Desconhecido',
        score: r._sum.valor || 0,
        total: r._count._all,
        // Score líquido normalizado de -100 a 100
        liquidScore: Math.round(((r._sum.valor || 0) / r._count._all) * 100)
      };
    }).sort((a, b) => b.liquidScore - a.liquidScore);

    // 2. Sentimento por Cargo
    const cargoRaw = await prisma.avaliacao.findMany({
      where: { criado_em: { gte: startDate }, is_valid: true },
      include: { candidato: { select: { cargo: true } } }
    });

    const cargoMap: Record<string, { apoio: number; neutro: number; rejeicao: number; total: number }> = {};
    cargoRaw.forEach(av => {
      const cargo = av.candidato.cargo;
      if (!cargoMap[cargo]) cargoMap[cargo] = { apoio: 0, neutro: 0, rejeicao: 0, total: 0 };
      
      if (av.valor > 0) cargoMap[cargo].apoio++;
      else if (av.valor < 0) cargoMap[cargo].rejeicao++;
      else cargoMap[cargo].neutro++;
      
      cargoMap[cargo].total++;
    });

    const cargoSentimento = Object.entries(cargoMap).map(([cargo, stats]) => ({
      cargo,
      apoio: Math.round((stats.apoio / stats.total) * 100),
      neutro: Math.round((stats.neutro / stats.total) * 100),
      rejeicao: Math.round((stats.rejeicao / stats.total) * 100),
    }));

    // 3. Temas (Atributos)
    const temasRaw = await prisma.avaliacao.groupBy({
      by: ['atributo_id'],
      _count: { _all: true },
      where: { criado_em: { gte: startDate }, is_valid: true },
      orderBy: { _count: { atributo_id: 'desc' } },
      take: 8
    });

    const atributos = await prisma.atributo.findMany({
      where: { id: { in: temasRaw.map(t => t.atributo_id) } },
      select: { id: true, nome: true }
    });

    const temas = temasRaw.map(t => ({
      name: atributos.find(a => a.id === t.atributo_id)?.nome || 'Outro',
      value: t._count._all
    }));

    // 4. Tendência de Sentimento (Últimos 30 dias)
    const tendenciaRaw = await prisma.avaliacao.findMany({
      where: { criado_em: { gte: startDate }, is_valid: true },
      select: { valor: true, criado_em: true }
    });

    const dailyStats: Record<string, { score: number; count: number }> = {};
    tendenciaRaw.forEach(av => {
      const day = startOfDay(av.criado_em).toISOString();
      if (!dailyStats[day]) dailyStats[day] = { score: 0, count: 0 };
      dailyStats[day].score += av.valor;
      dailyStats[day].count++;
    });

    const tendencia = Object.entries(dailyStats).map(([day, stats]) => ({
      dia: new Date(day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      score: Math.round((stats.score / stats.count) * 100)
    })).sort((a, b) => {
        const [dA, mA] = a.dia.split('/').map(Number);
        const [dB, mB] = b.dia.split('/').map(Number);
        return mA !== mB ? mA - mB : dA - dB;
    });

    // 5. Visibilidade x Polarização (Scatter Plot)
    const polarizacao = ranking.map(r => {
      // Polarização simples: razão de discordância (mínimo entre pos/neg / máximo)
      // Aqui simplificamos para mostrar dispersão
      return {
        x: r.total, // Visibilidade
        y: Math.abs(r.liquidScore), // Intensidade do Sentimento
        z: r.total, // Tamanho da bolha
        nome: r.nome
      };
    });

    return NextResponse.json({
      ranking,
      cargoSentimento,
      temas,
      tendencia,
      polarizacao,
      totalVotos: tendenciaRaw.length
    });

  } catch (error) {
    console.error('Error generating report data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
