'use client';

import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '@/hooks/api-hooks/useAuth';

export default function LogoutPage() {
  const { logout } = useAuth();

  // As soon as this page loads, call the logout function.
  useEffect(() => {
    logout();
  }, [logout]);

  // Render a simple loading state while the logout process completes.
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Logging out...
        </p>
      </div>
    </div>
  );
}