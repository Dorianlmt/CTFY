import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      challengesCount,
      teamsCount,
      usersCount,
      submissionsCount,
    ] = await Promise.all([
      prisma.challenge.count({ where: { isActive: true } }),
      prisma.team.count(),
      prisma.user.count(),
      prisma.submission.count(),
    ]);

    const totalPoints = await prisma.team.aggregate({
      _sum: {
        points: true,
      },
    });

    const averagePoints = teamsCount > 0 ? Math.floor((totalPoints._sum.points || 0) / teamsCount) : 0;

    return NextResponse.json({
      challenges: challengesCount,
      teams: teamsCount,
      users: usersCount,
      submissions: submissionsCount,
      averagePoints,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
