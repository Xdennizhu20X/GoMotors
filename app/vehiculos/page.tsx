'use client';

import { AdvancedCatalog } from '@/components/advanced-catalog';

const VehiculosPage = () => {
  // Get dealer ID directly from environment variable
  const dealerId = process.env.NEXT_PUBLIC_DEALER_ID;

  console.log('VehiculosPage - Using dealerId from env:', dealerId);

  return (
    <AdvancedCatalog dealerId={dealerId} />
  );
};

export default VehiculosPage;
