'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        router.back();
      }}
      className="text-blue-500 hover:underline mb-4"
    >
      Back
    </a>
  );
};

export default BackButton;
