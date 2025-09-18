import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hashPassword(password);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      team: true,
    },
  });
}

export async function createTeam(name: string, description?: string) {
  // Generate a random join code
  const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return prisma.team.create({
    data: {
      name,
      description,
      joinCode,
    },
  });
}

export async function joinTeam(joinCode: string, userId: string) {
  const team = await prisma.team.findUnique({
    where: { joinCode },
  });

  if (!team) {
    throw new Error('Code d\'équipe invalide');
  }

  return prisma.user.update({
    where: { id: userId },
    data: { teamId: team.id },
  });
}

export async function getTeamByJoinCode(joinCode: string) {
  return prisma.team.findUnique({
    where: { joinCode },
    include: {
      members: true,
    },
  });
}
