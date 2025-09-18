import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'points';

    const teams = await prisma.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: sortBy === 'lastSolve' 
        ? { lastSolveAt: 'desc' }
        : { points: 'desc' },
    });

    // Add rank to each team
    const teamsWithRank = teams.map((team, index) => ({
      ...team,
      rank: index + 1,
      membersCount: team._count.members,
    }));

    return NextResponse.json(teamsWithRank);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des équipes' },
      { status: 500 }
    );
  }
}
