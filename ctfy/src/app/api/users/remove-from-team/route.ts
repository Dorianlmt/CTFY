import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de l\'utilisateur requis' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        team: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (!user.teamId) {
      return NextResponse.json(
        { error: 'L\'utilisateur n\'est dans aucune équipe' },
        { status: 400 }
      );
    }

    // Get user's correct submissions to recalculate team points
    const correctSubmissions = await prisma.submission.findMany({
      where: {
        userId,
        isCorrect: true,
      },
      include: {
        challenge: {
          select: {
            points: true,
          },
        },
      },
    });

    // Calculate points to subtract from team
    const pointsToSubtract = correctSubmissions.reduce((sum, submission) => {
      return sum + submission.challenge.points;
    }, 0);

    // Remove user from team and subtract points
    await prisma.$transaction(async (tx) => {
      // Update user to remove team
      await tx.user.update({
        where: { id: userId },
        data: {
          teamId: null,
        },
      });

      // Update team points
      if (pointsToSubtract > 0) {
        await tx.team.update({
          where: { id: user.teamId },
          data: {
            points: {
              decrement: pointsToSubtract,
            },
          },
        });
      }
    });

    return NextResponse.json(
      { message: 'Utilisateur retiré de l\'équipe avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove user from team error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du retrait de l\'utilisateur de l\'équipe' },
      { status: 500 }
    );
  }
}
