'use client';

import { useActionState } from 'react';
import { FaFacebook } from 'react-icons/fa';

import { IconButton } from '@/components/button';
import { facebookLogin } from '@/actions';

export function FacebookLogin() {
  const [errorMessage, formAction, isPending] = useActionState(facebookLogin, null);

  return (
    <form action={formAction}>
      <IconButton variant="secondary" icon={FaFacebook} isPending={isPending} className="w-full">
        {errorMessage ? errorMessage : 'Continue with Facebook'}
      </IconButton>
    </form>
  );
}
