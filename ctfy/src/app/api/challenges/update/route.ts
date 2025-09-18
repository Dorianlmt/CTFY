import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, category, difficulty, points, flag, fileUrl, isActive } = await request.json();

    // Validate input
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

    // Validate difficulty if provided
    if (difficulty) {
      const validDifficulties = ['Facile', 'Moyen', 'Difficile'];
      if (!validDifficulties.includes(difficulty)) {
        return NextResponse.json(
          { error: 'Difficulté invalide' },
          { status: 400 }
        );
      }
    }

    // Validate points if provided
    if (points !== undefined) {
      if (points < 0 || points > 10000) {
        return NextResponse.json(
          { error: 'Les points doivent être entre 0 et 10000' },
          { status: 400 }
        );
      }
    }

    // Update challenge
    const challenge = await prisma.challenge.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(points !== undefined && { points: parseInt(points) }),
        ...(flag && { flag }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(
      { 
        message: 'Challenge mis à jour avec succès',
        challenge: {
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          difficulty: challenge.difficulty,
          points: challenge.points,
          fileUrl: challenge.fileUrl,
          isActive: challenge.isActive,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Challenge update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du challenge' },
      { status: 500 }
    );
  }
}
