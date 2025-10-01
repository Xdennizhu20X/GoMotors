import { useMemo } from 'react';
import { brands } from '@/config/brands';

const RUEDA_YA_BRAND_COLOR = '#1341EE';

export function useBrandColor(brandName?: string, customColor?: string): string {
  return useMemo(() => {
    // Si se proporciona un color personalizado, usar ese
    if (customColor) {
      return customColor;
    }

    // Si no hay nombre de marca, usar el color de Rueda Ya
    if (!brandName) {
      return RUEDA_YA_BRAND_COLOR;
    }

    // Buscar el color de la marca en la configuración
    const brand = brands.find(
      b => b.name.toLowerCase() === brandName.toLowerCase() ||
           b.id.toLowerCase() === brandName.toLowerCase()
    );

    // Retornar el color de la marca o el color de Rueda Ya como fallback
    return brand?.brandColor || RUEDA_YA_BRAND_COLOR;
  }, [brandName, customColor]);
}

export function getBrandColorVariants(baseColor: string) {
  // Generar variantes del color para diferentes usos
  return {
    primary: baseColor,
    light: `${baseColor}20`, // 20% opacity
    lighter: `${baseColor}10`, // 10% opacity
    lightest: `${baseColor}05`, // 5% opacity
    hover: `${baseColor}CC`, // 80% opacity
    medium: `${baseColor}60`, // 60% opacity
    dark: `${baseColor}DD`, // 87% opacity
    text: baseColor,
    background: `${baseColor}08`, // 8% opacity
    border: `${baseColor}30`, // 30% opacity
    gradient: `linear-gradient(135deg, ${baseColor}15, ${baseColor}08)`,
    radialGradient: `radial-gradient(circle at top right, ${baseColor}12, transparent 70%)`,
  };
}