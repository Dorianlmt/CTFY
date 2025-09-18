import { NextRequest, NextResponse } from 'next/server';
import { joinTeam, getTeamByJoinCode } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { joinCode, userId } = await request.json();

    // Validate input
    if (!joinCode || !userId) {
      return NextResponse.json(
        { error: 'Code d\'équipe et ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Check if team exists
    const team = await getTeamByJoinCode(joinCode);
    if (!team) {
      return NextResponse.json(
        { error: 'Code d\'équipe invalide' },
        { status: 400 }
      );
    }

    // Join team
    const updatedUser = await joinTeam(joinCode, userId);

    return NextResponse.json(
      { 
        message: 'Rejoint l\'équipe avec succès',
        team: {
          id: team.id,
          name: team.name,
          description: team.description,
        },
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          isAdmin: updatedUser.isAdmin,
          team: team,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Team join error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la jonction à l\'équipe' },
      { status: 500 }
    );
  }
}
