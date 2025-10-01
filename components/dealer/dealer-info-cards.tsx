'use client';

import { Card, Chip } from '@heroui/react';

interface DealerInfoCardsProps {
  dealer: {
    address?: string;
    phone?: string;
    email?: string;
    services?: string[];
  };
  workingHours: Record<string, string>;
  brandColor: string;
  colorVariants: {
    lightest: string;
    background: string;
    border: string;
  };
}

export function DealerInfoCards({ dealer, workingHours, brandColor, colorVariants }: DealerInfoCardsProps) {
  return (
    <>
      {/* Contact Information */}
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <Card className="p-4 border bg-white dark:bg-gray-900" style={{ borderColor: colorVariants.border }}>
          <h3 className="font-semibold mb-3 text-sm" style={{ color: brandColor }}>Información de Contacto</h3>
          <div className="space-y-2 text-sm">
            {dealer.address && (
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white">Dirección</span>
                <span className="text-gray-600 dark:text-gray-400">{dealer.address}</span>
              </div>
            )}
            {dealer.phone && (
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white">Teléfono</span>
                <span className="text-gray-600 dark:text-gray-400">{dealer.phone}</span>
              </div>
            )}
            {dealer.email && (
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white">Email</span>
                <span className="text-gray-600 dark:text-gray-400">{dealer.email}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Working Hours */}
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <Card className="p-4 border bg-white dark:bg-gray-900" style={{ borderColor: colorVariants.border }}>
          <h3 className="font-semibold mb-3 text-sm" style={{ color: brandColor }}>Horarios de Atención</h3>
          <div className="space-y-1 text-sm">
            {Object.entries(workingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <span className="text-gray-900 dark:text-white">
                  {day === 'monday' && 'Lun'}
                  {day === 'tuesday' && 'Mar'}
                  {day === 'wednesday' && 'Mié'}
                  {day === 'thursday' && 'Jue'}
                  {day === 'friday' && 'Vie'}
                  {day === 'saturday' && 'Sáb'}
                  {day === 'sunday' && 'Dom'}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-xs">{hours}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Services */}
      {dealer.services && dealer.services.length > 0 && (
        <div className="col-span-12 lg:col-span-4">
          <Card className="p-4 border bg-white dark:bg-gray-900" style={{ borderColor: colorVariants.border }}>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: brandColor }}>Servicios</h3>
            <div className="flex flex-wrap gap-1">
              {dealer.services.slice(0, 6).map((service, index) => (
                <Chip
                  key={`service-${service}-${index}`}
                  variant="flat"
                  size="sm"
                  className="text-xs"
                  style={{
                    backgroundColor: colorVariants.background,
                    color: brandColor,
                  }}
                >
                  {service}
                </Chip>
              ))}
              {dealer.services.length > 6 && (
                <Chip
                  variant="flat"
                  size="sm"
                  className="bg-gray-100 text-gray-600 text-xs"
                >
                  +{dealer.services.length - 6} más
                </Chip>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}