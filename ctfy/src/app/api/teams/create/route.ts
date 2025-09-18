import { NextRequest, NextResponse } from 'next/server';
import { createTeam } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de l\'équipe est requis' },
        { status: 400 }
      );
    }

    // Create team
    const team = await createTeam(name, description);

    return NextResponse.json(
      { 
        message: 'Équipe créée avec succès',
        team: {
          id: team.id,
          name: team.name,
          joinCode: team.joinCode,
          description: team.description,
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
