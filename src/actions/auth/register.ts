'use server';

import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import { prisma } from '@/lib/prisma';
import { registerSchema, RegisterSchemaType } from '@/lib/zod';
import { ServerActionResult } from '@/types';

export async function register(data: RegisterSchemaType): Promise<ServerActionResult<{ userId: string }>> {
  try {
    // Tips: safeParseではなくparseを使うとエラーが発生した場合にZodErrorがthrowされる
    const validatedData = registerSchema.parse(data);

    const { email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return {
      success: true,
      message: 'User registered successfully',
      data: { userId: user.id },
    };
  } catch (error: unknown) {
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
