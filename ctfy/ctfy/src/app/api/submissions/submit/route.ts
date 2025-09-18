import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, teamId, challengeId, flag } = await request.json();

    // Validate input
    if (!userId || !teamId || !challengeId || !flag) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Check if user exists and is in the team
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { team: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (user.teamId !== teamId) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas membre de cette équipe' },
        { status: 403 }
      );
    }

    // Check if challenge exists and is active
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge non trouvé' },
        { status: 404 }
      );
    }

    if (!challenge.isActive) {
      return NextResponse.json(
        { error: 'Ce challenge n\'est pas actif' },
        { status: 400 }
      );
    }

    // Check if user already submitted for this challenge
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Vous avez déjà soumis une réponse pour ce challenge' },
        { status: 400 }
      );
    }

    // Validate flag
    const isCorrect = flag.trim() === challenge.flag.trim();

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        flag: flag.trim(),
        isCorrect,
        userId,
        teamId,
        challengeId,
      },
    });

    // If correct, update team points and lastSolveAt
    if (isCorrect) {
      await prisma.team.update({
        where: { id: teamId },
        data: {
          points: {
            increment: challenge.points,
          },
          lastSolveAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      { 
        message: isCorrect ? 'Flag correct ! Points attribués.' : 'Flag incorrect.',
        isCorrect,
        points: isCorrect ? challenge.points : 0,
        submission: {
          id: submission.id,
          flag: submission.flag,
          isCorrect: submission.isCorrect,
          submittedAt: submission.submittedAt,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission' },
      { status: 500 }
    );
  }
}
