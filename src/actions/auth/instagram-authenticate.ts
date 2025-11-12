'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/lib/auth';
import { ServerActionResult } from '@/types';

export async function instagramAuthenticate(): Promise<ServerActionResult<null>> {
  try {
    await signIn('instagram', {
      redirect: false,
    });

    return {
      success: true,
      message: 'Instagram authentication successful!',
      data: null,
    };
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: 'Instagram authentication failed. Please try again.',
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
