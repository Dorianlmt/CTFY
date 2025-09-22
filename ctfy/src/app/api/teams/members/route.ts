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

    // Get team members with their stats
    const members = await prisma.user.findMany({
      where: { teamId },
      include: {
        submissions: {
          where: {
            isCorrect: true,
          },
          include: {
            challenge: {
              select: {
                points: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calculate member stats
    const membersWithStats = members.map(member => {
      const totalPoints = member.submissions.reduce((sum, submission) => {
        return sum + submission.challenge.points;
      }, 0);

      const solvedChallenges = member.submissions.length;

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        isAdmin: member.isAdmin,
        createdAt: member.createdAt,
        totalPoints,
        solvedChallenges,
      };
    });

    return NextResponse.json(membersWithStats, { status: 200 });
  } catch (error) {
    console.error('Team members fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des membres de l\'équipe' },
      { status: 500 }
    );
  }
}
