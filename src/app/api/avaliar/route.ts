import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSecureHash, isSuspiciousTiming } from '@/lib/hash';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      candidatoId, 
      avaliacoes, // Array de { atributoId, valor }
      fingerprint,
      startTime,
      endTime,
      honeypot 
    } = body;

    // 1. Honeypot check
    if (honeypot) {
      return NextResponse.json({ error: 'Bot detected' }, { status: 403 });
    }

    // 2. Timing validation (< 8s is suspicious)
    if (isSuspiciousTiming(startTime, endTime)) {
      console.warn('Suspicious timing detected for submission');
      // We still record it but could flag it or block it in a more advanced setup
    }

    // 3. Get IP and User Agent
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // 4. Generate hashes
    const ipHash = generateSecureHash(ip);
    const fingerprintHash = generateSecureHash(fingerprint);

    // 5. Check for active blocks
    const activeBlock = await prisma.bloqueio.findFirst({
      where: {
        hash: { in: [ipHash, fingerprintHash] },
        OR: [
          { expira_em: null },
          { expira_em: { gt: new Date() } }
        ]
      }
    });

    if (activeBlock) {
      return NextResponse.json({ error: 'Access blocked' }, { status: 429 });
    }

    // 6. Record evaluations in a transaction
    await prisma.$transaction(
      avaliacoes.map((av: { atributoId: string, valor: number }) => 
        prisma.avaliacao.create({
          data: {
            candidato_id: candidatoId,
            atributo_id: av.atributoId,
            valor: av.valor,
            fingerprint_hash: fingerprintHash,
            ip_hash: ipHash,
            user_agent: userAgent
          }
        })
      )
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error submitting evaluation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
