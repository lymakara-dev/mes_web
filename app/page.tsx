'use client';

import { useState } from 'react';
import { ChartBarInteractive } from './docs';

export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  return (
    <div>
      <h1>CICD JOB</h1>
      <div>
        <h1>From Shadcn</h1>
        <h2>usage: npx shadcn@latest add chart</h2>
        <ChartBarInteractive />
      </div>
      <div>
        <h1>API USAGE with react-query</h1>
        <h1>CICD with cache2</h1>
      </div>

    </div>
  );
}
