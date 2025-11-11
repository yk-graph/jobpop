'use server';

import { ZodError } from 'zod';
import { AuthError } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { loginSchema, LoginSchemaType } from '@/lib/zod';
import { ServerActionResult } from '@/types';
import { signIn } from '@/lib/auth';

export async function login(data: LoginSchemaType): Promise<ServerActionResult<{ userId: string }>> {
  try {
    // Tips: safeParseではなくparseを使うとエラーが発生した場合にZodErrorがthrowされる
    const validatedData = loginSchema.parse(data);

    const { email } = validatedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return {
      success: true,
      message: 'Successfully Signed In!',
      data: { userId: user.id },
    };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues.map((issue) => issue.message).join(', '),
      };
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            message: 'Invalid email or password',
          };
        default:
          return {
            success: false,
            message: 'An unknown authentication error occurred',
          };
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
