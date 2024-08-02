'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Actions = () => {
  const router = useRouter();

  useEffect(() => {
    async function handleLogout() {
      // Make a request to the logout API route
      await fetch('http://localhost:3000/api/logout', { method: 'GET' });
      
      // Redirect to the home page
      router.push('/');
    }
    
    handleLogout();
  }, [router]);

  return null;
};

export default Actions;
