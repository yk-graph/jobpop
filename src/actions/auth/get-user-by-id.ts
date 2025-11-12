import { User } from '@prisma/client';
import { ZodError } from 'zod';

import { prisma } from '@/lib/prisma';
import { ServerActionResult } from '@/types';

export async function getUserById(id: string): Promise<ServerActionResult<User>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      message: 'User found',
      data: user,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues.map((issue) => issue.message).join(', '),
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
