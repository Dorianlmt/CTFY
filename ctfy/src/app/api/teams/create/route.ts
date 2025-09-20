import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, description, joinCode, points } = await request.json();

    // Validate input
    if (!name || !joinCode) {
      return NextResponse.json(
        { error: 'Le nom et le code d\'invitation sont requis' },
        { status: 400 }
      );
    }

    // Check if team name already exists
    const existingTeam = await prisma.team.findUnique({
      where: { name },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Une équipe avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Check if join code already exists
    const existingJoinCode = await prisma.team.findUnique({
      where: { joinCode },
    });

    if (existingJoinCode) {
      return NextResponse.json(
        { error: 'Ce code d\'invitation est déjà utilisé' },
        { status: 400 }
      );
    }

    // Create team
    const team = await prisma.team.create({
      data: {
        name,
        description: description || null,
        joinCode,
        points: points || 0,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Team creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'équipe' },
      { status: 500 }
    );
  }
}