import { Suspense } from 'react';
import PRedirectClient from './PRedirectClient';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PRedirectClient />
    </Suspense>
  );
}
