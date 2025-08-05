'use client';

import { useLogin } from '@/hooks/api-hooks/userUser';
import { useState } from 'react';
import { ChartBarInteractive } from './docs';

export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div>
      <div>
        <h1>From Shadcn</h1>
        <h2>usage: npx shadcn@latest add chart</h2>
        <ChartBarInteractive />
      </div>
      <div>
        <h1>API USAGE</h1>
      </div>

    </div>
  );
}
