'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/lib/auth';
import { ServerActionResult } from '@/types';

export async function googleAuthenticate(): Promise<ServerActionResult<null>> {
  try {
    await signIn('google', {
      redirect: false,
    });

    return {
      success: true,
      message: 'Google authentication successful!',
      data: null,
    };
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: 'Google authentication failed. Please try again.',
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
