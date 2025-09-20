import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'ID de l\'équipe requis' },
        { status: 400 }
      );
    }

    // Get team details with members and solved challenges
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        submissions: {
          where: {
            isCorrect: true,
          },
          include: {
            challenge: {
              select: {
                id: true,
                title: true,
                category: true,
                difficulty: true,
                points: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Équipe non trouvée' },
        { status: 404 }
      );
    }

    // Calculate total points from solved challenges
    const totalPointsFromChallenges = team.submissions.reduce((sum, submission) => {
      return sum + submission.challenge.points;
    }, 0);

    // Group submissions by challenge to avoid duplicates
    const solvedChallenges = team.submissions.reduce((acc, submission) => {
      const challengeId = submission.challenge.id;
      if (!acc[challengeId]) {
        acc[challengeId] = {
          challenge: submission.challenge,
          solvedBy: submission.user,
          solvedAt: submission.submittedAt,
        };
      }
      return acc;
    }, {} as Record<string, any>);

    const teamDetails = {
      ...team,
      solvedChallenges: Object.values(solvedChallenges),
      totalPointsFromChallenges,
    };

    return NextResponse.json(teamDetails, { status: 200 });
  } catch (error) {
    console.error('Team details error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des détails de l\'équipe' },
      { status: 500 }
    );
  }
}
