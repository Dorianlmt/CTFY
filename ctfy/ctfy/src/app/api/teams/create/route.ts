import { NextRequest, NextResponse } from 'next/server';
import { createTeam } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, description, userId } = await request.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de l\'équipe est requis' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Check if user is already in a team
    if (user.teamId) {
      return NextResponse.json(
        { error: 'Vous êtes déjà dans une équipe' },
        { status: 400 }
      );
    }

    // Create team
    const team = await createTeam(name, description);

    // Add user to the team
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { teamId: team.id },
      include: {
        team: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'Équipe créée avec succès',
        team: {
          id: team.id,
          name: team.name,
          joinCode: team.joinCode,
          description: team.description,
        },
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          isAdmin: updatedUser.isAdmin,
          team: updatedUser.team,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Team creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'équipe' },
      { status: 500 }
    );
  }
}
