import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const prisma = new PrismaClient();

async function seedEssentials() {
  console.log('=== SEED ESSENCIAL — PULSO ELEITORAL ===\n');

  // ─── 1. CRIAR ATRIBUTOS ────────────────────────────────────────
  const atributosData = [
    { nome: 'Honestidade',     descricao: 'Integridade e transparência na conduta pública',  icone: '🛡️', polaridade: 1 },
    { nome: 'Competência',     descricao: 'Capacidade técnica e administrativa',              icone: '🎯', polaridade: 1 },
    { nome: 'Liderança',       descricao: 'Capacidade de mobilizar e guiar a comunidade',     icone: '🏛️', polaridade: 1 },
    { nome: 'Comunicação',     descricao: 'Clareza e acessibilidade na comunicação pública',  icone: '📢', polaridade: 1 },
    { nome: 'Compromisso Social', descricao: 'Atenção às causas sociais e ao bem-estar coletivo', icone: '🤝', polaridade: 1 },
    { nome: 'Corrupção',       descricao: 'Envolvimento em esquemas de corrupção',             icone: '💰', polaridade: -1 },
    { nome: 'Nepotismo',       descricao: 'Favorecimento de familiares e aliados',             icone: '👨‍👩‍👧', polaridade: -1 },
    { nome: 'Populismo',       descricao: 'Promessas sem viabilidade técnica ou fiscal',       icone: '🎭', polaridade: -1 },
  ];

  console.log('📝 Criando atributos...');
  const atributosCriados = [];
  for (const attr of atributosData) {
    const created = await prisma.atributo.upsert({
      where: { nome: attr.nome },
      update: {},
      create: attr,
    });
    atributosCriados.push(created);
    console.log(`   ✅ ${created.nome} (${created.polaridade > 0 ? 'POSITIVO' : 'NEGATIVO'})`);
  }

  // ─── 2. VINCULAR ATRIBUTOS ÀS CAMPANHAS DE 2022 E 2024 ────────
  const campanhasAlvo = await prisma.campanha.findMany({
    where: {
      slug: { in: ['ms-2022', 'ms-2024'] }
    }
  });

  console.log(`\n🔗 Vinculando atributos a ${campanhasAlvo.length} campanhas...`);
  for (const campanha of campanhasAlvo) {
    for (const atributo of atributosCriados) {
      // Verificar se já existe para evitar duplicatas
      const existing = await prisma.campanhaAtributo.findFirst({
        where: {
          campanha_id: campanha.id,
          atributo_id: atributo.id,
        }
      });
      if (!existing) {
        await prisma.campanhaAtributo.create({
          data: {
            campanha_id: campanha.id,
            atributo_id: atributo.id,
          }
        });
      }
    }
    console.log(`   ✅ Campanha "${campanha.nome}" — ${atributosCriados.length} atributos vinculados`);
  }

  // ─── 3. CRIAR PARÂMETROS ESSENCIAIS ────────────────────────────
  const parametrosData = [
    { chave: 'geral_ano_pleito',         valor: 2024,            grupo: 'geral',      descricao: 'Ano de pleito ativo' },
    { chave: 'geral_nome_plataforma',    valor: 'Voz Pública MS', grupo: 'geral',      descricao: 'Nome exibido na plataforma' },
    { chave: 'geral_ativo',             valor: true,            grupo: 'geral',      descricao: 'Plataforma em operação' },
    { chave: 'avaliacao_max_por_ip',     valor: 5,              grupo: 'seguranca',  descricao: 'Máximo de avaliações por IP/hora' },
    { chave: 'avaliacao_tempo_minimo',   valor: 8000,           grupo: 'seguranca',  descricao: 'Tempo mínimo em ms para avaliação válida' },
  ];

  console.log('\n⚙️ Criando parâmetros da plataforma...');
  for (const param of parametrosData) {
    await prisma.parametroPlataforma.upsert({
      where: { chave: param.chave },
      update: { valor: param.valor },
      create: param,
    });
    console.log(`   ✅ ${param.chave} = ${JSON.stringify(param.valor)}`);
  }

  // ─── 4. VERIFICAÇÃO FINAL ──────────────────────────────────────
  const totalAtributos = await prisma.atributo.count();
  const totalVinculos = await prisma.campanhaAtributo.count();
  const totalParametros = await prisma.parametroPlataforma.count();
  const totalCandidatos2224 = await prisma.candidato.count({
    where: { ano_eleicao: { in: [2022, 2024] } }
  });

  console.log('\n=== VERIFICAÇÃO FINAL ===');
  console.log(`✅ Atributos: ${totalAtributos}`);
  console.log(`✅ Vínculos campanha-atributo: ${totalVinculos}`);
  console.log(`✅ Parâmetros da plataforma: ${totalParametros}`);
  console.log(`✅ Candidatos 2022+2024: ${totalCandidatos2224}`);
  console.log('\n✨ Seed essencial concluído com sucesso!');
}

seedEssentials()
  .catch(e => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
