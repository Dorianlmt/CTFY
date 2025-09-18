import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID du challenge requis' },
        { status: 400 }
      );
    }

    // Check if challenge exists
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id },
    });

    if (!existingChallenge) {
      return NextResponse.json(
        { error: 'Challenge non trouvé' },
        { status: 404 }
      );
    }

    // Delete challenge (this will also delete related submissions due to cascade)
    await prisma.challenge.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Challenge supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Challenge deletion error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du challenge' },
      { status: 500 }
    );
  }
}
