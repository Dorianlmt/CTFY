import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const where: any = {
      isActive: true,
    };

    if (category && category !== 'Tous') {
      where.category = category;
    }

    if (difficulty && difficulty !== 'Toutes') {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const challenges = await prisma.challenge.findMany({
      where,
      orderBy: [
        { difficulty: 'asc' },
        { points: 'asc' },
      ],
    });

    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des challenges' },
      { status: 500 }
    );
  }
}
