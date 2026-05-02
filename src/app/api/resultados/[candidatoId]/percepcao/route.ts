import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ candidatoId: string }> }
) {
  const { candidatoId } = await params;

  try {
    // 1. Fetch all manifestations for this candidate
    const manifestacoes = await prisma.manifestacao.findMany({
      where: { 
        candidato_id: candidatoId,
        is_valid: true 
      },
      include: {
        avaliacoes: {
          include: {
            atributo: true
          }
        }
      }
    });

    // 2. Calculate Paraná Pesquisas Indicators
    const total = manifestacoes.length;
    const aprovacoes = manifestacoes.filter(m => m.aprovacao === true).length;
    const desaprovacoes = manifestacoes.filter(m => m.aprovacao === false).length;
    const expectativaGanha = manifestacoes.filter(m => m.expectativa_vitoria === true).length;

    const parana = {
      aprovacao: total > 0 ? (aprovacoes / total) * 100 : 0,
      desaprovacao: total > 0 ? (desaprovacoes / total) * 100 : 0,
      expectativaVitoria: total > 0 ? (expectativaGanha / total) * 100 : 0,
      totalManifestacoes: total
    };

    // 3. Calculate Datafolha Matrix (Confidence vs Competence)
    // We'll group attributes into these two categories (this is illustrative)
    // In a real scenario, these would be mapped in the database
    const confiancaAtributos = ['Honestidade', 'Ética', 'Sinceridade', 'Verdadeiro', 'Ficha Limpa'];
    const competenciaAtributos = ['Capacidade de Gestão', 'Inteligência', 'Experiência', 'Preparado', 'Eficiente'];

    let confiancaScore = 0;
    let competenciaScore = 0;
    let confiancaCount = 0;
    let competenciaCount = 0;

    manifestacoes.forEach(m => {
      m.avaliacoes.forEach(av => {
        if (confiancaAtributos.includes(av.atributo.nome)) {
          confiancaScore += av.valor;
          confiancaCount++;
        }
        if (competenciaAtributos.includes(av.atributo.nome)) {
          competenciaScore += av.valor;
          competenciaCount++;
        }
      });
    });

    const datafolha = {
      confianca: confiancaCount > 0 ? (confiancaScore / confiancaCount) * 10 : 0, // Scale 0-10
      competencia: competenciaCount > 0 ? (competenciaScore / competenciaCount) * 10 : 0
    };

    // 4. Socio-demographic breakdown (Ibope)
    const segmentacao = {
      sexo: {
        masculino: manifestacoes.filter(m => (m.perfil as any)?.sexo === 'Masculino').length,
        feminino: manifestacoes.filter(m => (m.perfil as any)?.sexo === 'Feminino').length,
      },
      faixaEtaria: {
        jovem: manifestacoes.filter(m => ['16-24', '25-34'].includes((m.perfil as any)?.idade)).length,
        adulto: manifestacoes.filter(m => ['35-44', '45-59'].includes((m.perfil as any)?.idade)).length,
        senior: manifestacoes.filter(m => (m.perfil as any)?.idade === '60+').length,
      }
    };

    return NextResponse.json({
      parana,
      datafolha,
      segmentacao,
      totalVozes: total
    });
  } catch (error) {
    console.error('Error fetching advanced results:', error);
    // Fallback empty data if tables don't exist yet (migration issues)
    return NextResponse.json({
      parana: { aprovacao: 0, desaprovacao: 0, expectativaVitoria: 0, totalManifestacoes: 0 },
      datafolha: { confianca: 0, competencia: 0 },
      segmentacao: { sexo: { masculino: 0, feminino: 0 }, faixaEtaria: { jovem: 0, adulto: 0, senior: 0 } },
      totalVozes: 0
    });
  }
}
