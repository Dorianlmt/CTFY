import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de l\'utilisateur requis' },
        { status: 400 }
      );
    }

    // Get user submissions with challenge details
    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            points: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.error('User submissions fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des soumissions' },
      { status: 500 }
    );
  }
}
