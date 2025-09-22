import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        team: {
          select: {
            id: true,
            name: true,
            points: true,
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
                points: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate user stats
    const usersWithStats = users.map(user => {
      const totalPoints = user.submissions.reduce((sum, submission) => {
        return sum + submission.challenge.points;
      }, 0);

      const solvedChallenges = user.submissions.length;

      return {
        ...user,
        totalPoints,
        solvedChallenges,
      };
    });

    return NextResponse.json(usersWithStats, { status: 200 });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}
