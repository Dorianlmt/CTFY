import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, difficulty, points, flag, fileUrl } = await request.json();

    // Validate input
    if (!title || !description || !category || !difficulty || !points || !flag) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validate difficulty
    const validDifficulties = ['Facile', 'Moyen', 'Difficile'];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: 'Difficulté invalide' },
        { status: 400 }
      );
    }

    // Validate points
    if (points < 0 || points > 10000) {
      return NextResponse.json(
        { error: 'Les points doivent être entre 0 et 10000' },
        { status: 400 }
      );
    }

    // Create challenge
    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        category,
        difficulty,
        points: parseInt(points),
        flag,
        fileUrl: fileUrl || null,
      },
    });

    return NextResponse.json(
      { 
        message: 'Challenge créé avec succès',
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
      { status: 201 }
    );
  } catch (error) {
    console.error('Challenge creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du challenge' },
      { status: 500 }
    );
  }
}
