import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'équipe requis' },
        { status: 400 }
      );
    }

    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { error: 'Équipe non trouvée' },
        { status: 404 }
      );
    }

    // Check if team has members
    if (existingTeam.members.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une équipe qui a des membres. Veuillez d\'abord retirer tous les membres.' },
        { status: 400 }
      );
    }

    // Delete team
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Équipe supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Team deletion error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'équipe' },
      { status: 500 }
    );
  }
}
