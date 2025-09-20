import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, joinCode, points } = await request.json();

    // Validate input
    if (!id || !name || !joinCode) {
      return NextResponse.json(
        { error: 'L\'ID, le nom et le code d\'invitation sont requis' },
        { status: 400 }
      );
    }

    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { error: 'Équipe non trouvée' },
        { status: 404 }
      );
    }

    // Check if team name already exists (excluding current team)
    const nameConflict = await prisma.team.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });

    if (nameConflict) {
      return NextResponse.json(
        { error: 'Une équipe avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Check if join code already exists (excluding current team)
    const joinCodeConflict = await prisma.team.findFirst({
      where: {
        joinCode,
        id: { not: id },
      },
    });

    if (joinCodeConflict) {
      return NextResponse.json(
        { error: 'Ce code d\'invitation est déjà utilisé' },
        { status: 400 }
      );
    }

    // Update team
    const team = await prisma.team.update({
      where: { id },
      data: {
        name,
        description: description || null,
        joinCode,
        points: points || 0,
      },
    });

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error('Team update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'équipe' },
      { status: 500 }
    );
  }
}
