export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: 'manual' | 'automatica' | 'cvt';
  fuelType: 'gasolina' | 'diesel' | 'hibrido' | 'electrico';
  imageUrl: string;
  image?: string; // For compatibility with comparison page
  stock: number;
  mileage?: number;
  color?: string;
  engine?: string;
  features?: string[];
  location?: string;
  rating?: number; // Vehicle rating (1-5 stars)
  dealerId?: string;
  dealerName?: string;
  dealerLocation?: string;
}

export const vehicles: Vehicle[] = [
  {
    id: '1',
    _id: '68c3d10ad14dcfb039a0c6fa', // Simular MongoDB ID
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    price: 25000,
    transmission: 'automatica',
    fuelType: 'gasolina',
    imageUrl: '/carro.png',
    stock: 5,
    mileage: 15000,
    color: 'Blanco Perla',
    engine: '1.8L',
    features: ['Aire acondicionado', 'Sistema de navegación', 'Cámara trasera'],
    location: 'Quito',
    dealerId: 'dealer_toyota_quito',
    dealerName: 'Toyota Quito',
    dealerLocation: 'Quito',
    availableColors: [
      {
        name: 'Blanco Perla',
        value: 'blanco-perla',
        hexCode: '#F8F8FF',
        available: true
      },
      {
        name: 'Negro Metálico',
        value: 'negro-metalico',
        hexCode: '#1C1C1E',
        available: true
      },
      {
        name: 'Gris Oxford',
        value: 'gris-oxford',
        hexCode: '#8B8680',
        available: true
      }
    ]
  } as any,
  {
    id: '2',
    brand: 'Chevrolet',
    model: 'Cruze',
    year: 2022,
    price: 22000,
    transmission: 'manual',
    fuelType: 'gasolina',
    imageUrl: '/carro.png',
    stock: 3,
    mileage: 25000,
    color: 'Negro',
    engine: '1.4L Turbo',
    features: ['Bluetooth', 'Control de crucero', 'Sensores de parqueo'],
    location: 'Guayaquil'
  },
  {
    id: '3',
    brand: 'Ford',
    model: 'Escape',
    year: 2024,
    price: 35000,
    transmission: 'automatica',
    fuelType: 'hibrido',
    imageUrl: '/carro.png',
    stock: 2,
    mileage: 5000,
    color: 'Azul',
    engine: '2.5L Hybrid',
    features: ['Pantalla táctil', 'Asientos de cuero', 'Techo panorámico'],
    location: 'Cuenca',
    dealerId: 'dealer_ford_cuenca',
    dealerName: 'Ford Cuenca',
    dealerLocation: 'Cuenca'
  },
  {
    id: '4',
    brand: 'Volkswagen',
    model: 'Jetta',
    year: 2023,
    price: 28000,
    transmission: 'automatica',
    fuelType: 'gasolina',
    imageUrl: '/carro.png',
    stock: 4,
    mileage: 18000,
    color: 'Gris',
    engine: '1.4L TSI',
    features: ['Android Auto', 'Apple CarPlay', 'Faros LED'],
    location: 'Quito'
  },
  {
    id: '5',
    brand: 'Kia',
    model: 'Sportage',
    year: 2022,
    price: 30000,
    transmission: 'cvt',
    fuelType: 'gasolina',
    imageUrl: '/carro.png',
    stock: 6,
    mileage: 22000,
    color: 'Rojo',
    engine: '2.4L',
    features: ['Sistema de seguridad avanzado', 'Carga inalámbrica', 'Climatizador dual'],
    location: 'Guayaquil'
  },
  {
    id: '6',
    _id: '68c3d10ad14dcfb039a0c716', // ID que se está buscando
    brand: 'Peugeot',
    model: '3008',
    year: 2024,
    price: 42000,
    transmission: 'automatica',
    fuelType: 'gasolina',
    imageUrl: 'https://cdn.ruedaya.com/vehicles/peugeot-3008-2024.jpg',
    images: ['https://cdn.ruedaya.com/vehicles/peugeot-3008-2024.jpg'],
    stock: 3,
    mileage: 0, // Vehículo nuevo
    color: 'Blanco Perla',
    engine: '1.6L PureTech',
    features: ['Cockpit digital', 'Masaje en asientos', 'Reconocimiento de señales', 'Conectividad avanzada'],
    location: 'Quito',
    dealerId: 'dealer_peugeot_quito',
    dealerName: 'Peugeot Quito',
    dealerLocation: 'Quito',
    availableColors: [
      {
        name: 'Blanco Perla',
        value: 'blanco-perla',
        hexCode: '#F8F8FF',
        available: true
      },
      {
        name: 'Negro Metálico',
        value: 'negro-metalico', 
        hexCode: '#1C1C1E',
        available: true
      },
      {
        name: 'Gris Platino',
        value: 'gris-platino',
        hexCode: '#71797E',
        available: true
      }
    ],
    images3D: {
      exterior: ['https://cdn.ruedaya.com/vehicles/peugeot-3008-2024-exterior-1.jpg'],
      interior: ['https://cdn.ruedaya.com/vehicles/peugeot-3008-2024-interior-1.jpg'],
      details: ['https://cdn.ruedaya.com/vehicles/peugeot-3008-2024-details-1.jpg']
    }
  } as any,
  {
    id: '7',
    brand: 'Toyota',
    model: 'Prius',
    year: 2024,
    price: 38000,
    transmission: 'automatica',
    fuelType: 'hibrido',
    imageUrl: '/carro.png',
    stock: 2,
    mileage: 8000,
    color: 'Verde',
    engine: '1.8L Hybrid',
    features: ['Eficiencia máxima', 'Paneles solares', 'Head-up display'],
    location: 'Quito'
  },
  {
    id: '8',
    brand: 'Ford',
    model: 'Mustang',
    year: 2023,
    price: 55000,
    transmission: 'manual',
    fuelType: 'gasolina',
    imageUrl: '/carro.png',
    stock: 1,
    mileage: 10000,
    color: 'Amarillo',
    engine: '5.0L V8',
    features: ['Performance Package', 'Sonido Premium', 'Track Apps'],
    location: 'Guayaquil'
  }
];