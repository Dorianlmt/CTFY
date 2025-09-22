import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');

    if (!submissionId) {
      return NextResponse.json(
        { error: 'ID de la soumission requis' },
        { status: 400 }
      );
    }

    // Get submission details
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        challenge: {
          select: {
            points: true,
          },
        },
        team: {
          select: {
            id: true,
            points: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Soumission non trouvée' },
        { status: 404 }
      );
    }

    // If it was a correct submission, subtract points from team
    if (submission.isCorrect && submission.team) {
      await prisma.team.update({
        where: { id: submission.team.id },
        data: {
          points: {
            decrement: submission.challenge.points,
          },
        },
      });
    }

    // Delete the submission
    await prisma.submission.delete({
      where: { id: submissionId },
    });

    return NextResponse.json(
      { message: 'Soumission supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submission deletion error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la soumission' },
      { status: 500 }
    );
  }
}
