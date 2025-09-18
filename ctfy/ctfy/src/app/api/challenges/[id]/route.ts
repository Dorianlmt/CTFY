import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du challenge requis' },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        submissions: {
          select: {
            id: true,
            isCorrect: true,
            submittedAt: true,
            user: {
              select: {
                name: true,
                team: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(challenge, { status: 200 });
  } catch (error) {
    console.error('Challenge fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du challenge' },
      { status: 500 }
    );
  }
}
