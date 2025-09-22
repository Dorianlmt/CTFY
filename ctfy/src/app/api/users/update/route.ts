import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const { id, name, email, isAdmin, teamId } = await request.json();

    // Validate input
    if (!id || !name || !email) {
      return NextResponse.json(
        { error: 'L\'ID, le nom et l\'email sont requis' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Check if email already exists (excluding current user)
    const emailConflict = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    });

    if (emailConflict) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé par un autre utilisateur' },
        { status: 400 }
      );
    }

    // Check if team exists (if teamId is provided)
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        return NextResponse.json(
          { error: 'Équipe non trouvée' },
          { status: 400 }
        );
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        isAdmin: isAdmin || false,
        teamId: teamId || null,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            points: true,
          },
        },
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}
