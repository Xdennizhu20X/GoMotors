'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Badge,
  Tooltip,
  ScrollShadow,
  Progress,
  Divider,
} from '@heroui/react';
import {
  SearchIcon,
  CheckIcon,
  XMarkIcon,
  TrophyIcon,
  BoltIcon,
  BanknotesIcon,
  FuelIcon,
  CalendarIcon,
  MapPinIcon,
  Cog6ToothIcon,
  StarIcon,
  PlusIcon,
  TrashIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
} from '@/components/icons';
import apiClient from '@/lib/api-client';
import type { Vehicle } from '@/config/vehicles';
import Image from 'next/image';
import { useDealerTheme } from '@/hooks/useDealerTheme';

interface ComparisonVehicle extends Vehicle {
  score?: number;
  pros?: string[];
  cons?: string[];
  bestCategories?: string[];
}

interface CategoryScore {
  category: string;
  icon: React.ReactNode;
  weight: number;
  getValue: (vehicle: Vehicle) => number | string;
  format?: (value: any) => string;
  higherIsBetter?: boolean;
}

const CompararPage = () => {
  const { primaryColor, dealer } = useDealerTheme();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<ComparisonVehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<any>(null);

  // Maximum vehicles to compare
  const MAX_COMPARISON = 4;

  // Helper function to safely format percentage
  const formatPercentage = (score?: number): string => {
    if (!score || isNaN(score) || !isFinite(score)) {
      return '0';
    }
    return Math.round(Math.max(0, Math.min(100, score * 100))).toString();
  };

  // Categories for comparison with scoring weights
  const categories: CategoryScore[] = [
    {
      category: 'Precio',
      icon: <BanknotesIcon className="w-5 h-5" />,
      weight: 0.25,
      getValue: (v) => v.price,
      format: (value) => `$${value.toLocaleString()}`,
      higherIsBetter: false,
    },
    {
      category: 'Kilometraje',
      icon: <ChartBarIcon className="w-5 h-5" />,
      weight: 0.15,
      getValue: (v) => v.mileage || 0,
      format: (value) => `${value.toLocaleString()} km`,
      higherIsBetter: false,
    },
    {
      category: 'Año',
      icon: <CalendarIcon className="w-5 h-5" />,
      weight: 0.15,
      getValue: (v) => v.year,
      format: (value) => value.toString(),
      higherIsBetter: true,
    },
    {
      category: 'Combustible',
      icon: <FuelIcon className="w-5 h-5" />,
      weight: 0.10,
      getValue: (v) => v.fuelType,
      format: (value) => {
        const types: { [key: string]: string } = {
          'gasolina': 'Gasolina',
          'diesel': 'Diesel',
          'hibrido': 'Híbrido',
          'electrico': 'Eléctrico',
        };
        return types[value] || value;
      },
    },
    {
      category: 'Transmisión',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      weight: 0.10,
      getValue: (v) => v.transmission,
      format: (value) => {
        const types: { [key: string]: string } = {
          'manual': 'Manual',
          'automatica': 'Automática',
          'cvt': 'CVT',
        };
        return types[value] || value;
      },
    },
    {
      category: 'Motor',
      icon: <BoltIcon className="w-5 h-5" />,
      weight: 0.10,
      getValue: (v) => v.engine || 'N/A',
      format: (value) => value,
    },
    {
      category: 'Ubicación',
      icon: <MapPinIcon className="w-5 h-5" />,
      weight: 0.05,
      getValue: (v) => v.location || 'N/A',
      format: (value) => value,
    },
    {
      category: 'Calificación',
      icon: <StarIcon className="w-5 h-5" />,
      weight: 0.10,
      getValue: (v) => v.rating || 4.0,
      format: (value) => `${value}`,
      higherIsBetter: true,
    },
  ];

  // Fetch available vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const params: any = { page: 1, limit: 50 };

      // IMPORTANT: Filter by dealer ID from environment variable
      const dealerId = process.env.NEXT_PUBLIC_DEALER_ID;
      if (dealerId) {
        params.dealer = dealerId;
        console.log('Comparar - Filtering vehicles by dealer:', dealerId);
      }

      if (selectedBrand) params.brand = selectedBrand;
      if (searchTerm) params.search = searchTerm;

      const response = await apiClient.getVehicles(params);

      let vehiclesData = [];
      // Handle both API formats: {status: 'success'} and {success: true}
      const isSuccess = (response as any).status === 'success' || response.success === true;

      if (isSuccess && response.data) {
        if (response.data.vehicles) {
          vehiclesData = response.data.vehicles;
        } else if (Array.isArray(response.data)) {
          vehiclesData = response.data;
        }
      }

      // Normalize vehicles data and ensure each has a valid ID
      const normalizedVehicles = vehiclesData.map((vehicle: any, index: number) => ({
        ...vehicle,
        id: vehicle.id || vehicle._id || `vehicle-${index}-${Date.now()}`, // Ensure valid ID
        imageUrl: vehicle.imageUrl || vehicle.image || '/carro.png',
        transmission: vehicle.transmission || 'manual',
        fuelType: vehicle.fuelType || 'gasolina',
        rating: vehicle.rating || 4.0,
        mileage: vehicle.mileage || 0,
        stock: vehicle.stock || 1,
      }));

      setVehicles(normalizedVehicles);
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      // Use mock data as fallback
      setVehicles(getMockVehicles());
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator
  const getMockVehicles = (): Vehicle[] => {
    return [
      {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        price: 25000,
        imageUrl: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
        transmission: 'automatica',
        fuelType: 'hibrido',
        engine: '1.8L Hybrid',
        mileage: 5000,
        location: 'Quito',
        stock: 3,
        rating: 4.8,
      },
      {
        id: '2',
        brand: 'Chevrolet',
        model: 'Onix',
        year: 2024,
        price: 18000,
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 
        transmission: 'manual',
        fuelType: 'gasolina',
        engine: '1.0L Turbo',
        mileage: 0,
        location: 'Guayaquil',
        stock: 5,
        rating: 4.5,
      },
      {
        id: '3',
        brand: 'Volkswagen',
        model: 'Jetta',
        year: 2023,
        price: 28000,
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        transmission: 'automatica',
        fuelType: 'gasolina',
        engine: '1.4L TSI',
        mileage: 8000,
        location: 'Cuenca',
        stock: 2,
        rating: 4.6,
      },
      {
        id: '4',
        brand: 'Kia',
        model: 'Sportage',
        year: 2024,
        price: 35000,
        imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
        transmission: 'automatica',
        fuelType: 'hibrido',
        engine: '1.6L T-GDI Hybrid',
        mileage: 1000,
        location: 'Quito',
        stock: 4,
        rating: 4.9,
      },
      {
        id: '5',
        brand: 'Ford',
        model: 'Escape',
        year: 2022,
        price: 32000,
        imageUrl: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800',
        transmission: 'automatica',
        fuelType: 'gasolina',
        engine: '2.0L EcoBoost',
        mileage: 15000,
        location: 'Guayaquil',
        stock: 2,
        rating: 4.4,
      },
    ];
  };

  // Calculate scores and determine best options
  const calculateComparison = () => {
    if (selectedVehicles.length < 2) return;

    const vehiclesWithScores = selectedVehicles.map(vehicle => {
      let totalScore = 0;
      const bestCategories: string[] = [];
      const pros: string[] = [];
      const cons: string[] = [];

      categories.forEach(cat => {
        const value = cat.getValue(vehicle);
        let categoryScore = 0;

        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
          // Normalize scores across all selected vehicles
          const allValues = selectedVehicles.map(v => {
            const val = cat.getValue(v);
            return typeof val === 'number' && !isNaN(val) && isFinite(val) ? val : 0;
          }).filter(v => v >= 0);

          if (allValues.length === 0) {
            categoryScore = cat.weight * 0.5;
          } else {
            const min = Math.min(...allValues);
            const max = Math.max(...allValues);

            if (max !== min && max > 0) {
              if (cat.higherIsBetter) {
                categoryScore = ((value - min) / (max - min)) * cat.weight;
              } else {
                categoryScore = ((max - value) / (max - min)) * cat.weight;
              }
            } else {
              categoryScore = cat.weight * 0.5;
            }

            // Ensure categoryScore is valid
            if (isNaN(categoryScore) || !isFinite(categoryScore)) {
              categoryScore = cat.weight * 0.5;
            }

            // Check if this vehicle has the best value in this category
            const isBest = cat.higherIsBetter 
              ? value === max 
              : value === min;

            if (isBest && allValues.length > 1 && max !== min) {
              bestCategories.push(cat.category);
            }
          }
        } else {
          // For non-numeric values, assign default score
          categoryScore = cat.weight * 0.5;
        }

        totalScore += categoryScore;
      });

      // Determine pros and cons
      if (vehicle.year >= 2023) pros.push('Modelo reciente');
      if (vehicle.mileage && vehicle.mileage < 10000) pros.push('Bajo kilometraje');
      if (vehicle.fuelType === 'hibrido' || vehicle.fuelType === 'electrico') pros.push('Eco-friendly');
      if (vehicle.rating && vehicle.rating >= 4.5) pros.push('Alta calificación');
      if (vehicle.transmission === 'automatica') pros.push('Transmisión automática');

      if (vehicle.price > 30000) cons.push('Precio elevado');
      if (vehicle.mileage && vehicle.mileage > 20000) cons.push('Alto kilometraje');
      if (vehicle.year < 2022) cons.push('Modelo antiguo');
      if (vehicle.stock && vehicle.stock < 2) cons.push('Poco stock');

      // Ensure totalScore is valid
      const finalScore = isNaN(totalScore) || !isFinite(totalScore) ? 0.5 : totalScore;
      const clampedScore = Math.max(0, Math.min(1, finalScore));

      return {
        ...vehicle,
        score: clampedScore,
        bestCategories,
        pros,
        cons,
      };
    });

    // Sort by score
    vehiclesWithScores.sort((a, b) => (b.score || 0) - (a.score || 0));

    setComparison({
      vehicles: vehiclesWithScores,
      winner: vehiclesWithScores[0],
    });
  };

  // Add vehicle to comparison
  const addToComparison = (vehicle: Vehicle) => {
    // Prevent adding if already at max capacity
    if (selectedVehicles.length >= MAX_COMPARISON) {
      alert(`Máximo ${MAX_COMPARISON} vehículos para comparar`);
      return;
    }
    
    // Prevent adding duplicate vehicles
    if (selectedVehicleIds.has(vehicle.id)) {
      alert('Este vehículo ya está en la comparación');
      return;
    }

    // Add vehicle to selection
    setSelectedVehicles(prev => [...prev, vehicle]);
    setIsModalOpen(false);
  };

  // Remove vehicle from comparison
  const removeFromComparison = (vehicleId: string) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
    setComparison(null);
  };

  // Clear all comparison
  const clearComparison = () => {
    setSelectedVehicles([]);
    setComparison(null);
  };

  // Memoized selected vehicle IDs for performance
  const selectedVehicleIds = useMemo(() => 
    new Set(selectedVehicles.map(v => v.id)), 
    [selectedVehicles]
  );

  // Effects
  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicles.length >= 2) {
      calculateComparison();
    } else {
      setComparison(null);
    }
  }, [selectedVehicles]);

  // Get winner indicator
  const getWinnerBadge = (vehicle: ComparisonVehicle, index: number) => {
    if (!comparison) return null;
    
    if (index === 0) {
      return (
        <Badge 
          content={<TrophyIcon className="w-4 h-4" />} 
          color="warning" 
          placement="top-right"
          className="animate-bounce"
        >
          <div className="absolute inset-0"></div>
        </Badge>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Comparador de Vehículos
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Selecciona hasta {MAX_COMPARISON} vehículos para comparar características, precios y encontrar la mejor opción
          </p>
        </motion.div>

        {/* Selection Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center items-center mb-8">
            <Button
              size="lg"
              variant="flat"
              startContent={<PlusIcon className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
              isDisabled={selectedVehicles.length >= MAX_COMPARISON}
              className="text-white font-medium px-6"
              style={{
                backgroundColor: primaryColor,
                // @ts-ignore
                '--hover-opacity': '0.9'
              }}
            >
              Agregar Vehículo
            </Button>

            {selectedVehicles.length >= 2 && (
              <>
                <Button
                  size="lg"
                  variant="bordered"
                  startContent={<ArrowsRightLeftIcon className="w-4 h-4" />}
                  onClick={calculateComparison}
                  className="font-medium px-6"
                  style={{
                    borderColor: primaryColor,
                    color: primaryColor,
                    // @ts-ignore
                    '--hover-bg': `${primaryColor}0d`
                  }}
                >
                  Comparar
                </Button>
                <Button
                  size="lg"
                  variant="light"
                  startContent={<TrashIcon className="w-4 h-4" />}
                  onClick={clearComparison}
                  className="text-foreground/60 hover:text-foreground font-medium px-6"
                >
                  Limpiar
                </Button>
              </>
            )}
          </div>

          {/* Selected Vehicles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: MAX_COMPARISON }).map((_, index) => {
              const vehicle = selectedVehicles[index];
              
              if (!vehicle) {
                return (
                  <motion.div
                    key={`empty-slot-${index}`}
                    variants={itemVariants}
                    className="relative"
                  >
                    <Card
                      className="h-full border-2 border-dashed border-default-300 transition-colors"
                      style={{
                        // @ts-ignore
                        '--hover-border-color': `${primaryColor}4d`
                      }}
                    >
                      <CardBody className="flex items-center justify-center min-h-[280px]">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-default-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <PlusIcon className="w-6 h-6 text-default-400" />
                          </div>
                          <p className="text-sm text-default-400 mb-3">
                            Vehículo {index + 1}
                          </p>
                          <Button
                            size="sm"
                            variant="flat"
                            className="text-xs font-medium"
                            style={{
                              backgroundColor: `${primaryColor}1a`,
                              color: primaryColor,
                              // @ts-ignore
                              '--hover-opacity': '0.3'
                            }}
                            onClick={() => setIsModalOpen(true)}
                          >
                            Seleccionar
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={`selected-vehicle-${vehicle.id}`}
                  variants={itemVariants}
                  className="relative"
                >
                  {comparison && getWinnerBadge(vehicle, index)}
                  
                  <Card className="h-full hover:shadow-lg transition-all duration-200 border border-default-200">
                    <CardHeader className="pb-3 pt-3 px-4 flex-col items-start">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="absolute top-3 right-3 z-10 text-default-400 hover:text-danger"
                        onClick={() => removeFromComparison(vehicle.id)}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </Button>
                      
                      <div className="w-full">
                        <div className="relative h-28 mb-3 rounded-lg overflow-hidden">
                          <Image
                            src={vehicle.imageUrl || vehicle.image || '/carro.png'}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="font-semibold text-lg text-foreground">{vehicle.brand}</h4>
                        <p className="text-default-500 mb-1">{vehicle.model}</p>
                        <p className="text-xl font-bold" style={{ color: primaryColor }}>
                          ${vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    </CardHeader>

                    <CardBody className="px-4 py-3">
                      {comparison && vehicle.score !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-default-500 uppercase tracking-wide">Puntuación</span>
                            <span className="text-sm font-bold" style={{ color: primaryColor }}>
                              {formatPercentage(vehicle.score)}%
                            </span>
                          </div>
                          <Progress
                            value={parseFloat(formatPercentage(vehicle.score))}
                            color={index === 0 ? "warning" : "primary"}
                            className="h-1.5"
                            classNames={{
                              track: "bg-default-200",
                              indicator: index === 0 ? "bg-warning" : ""
                            }}
                            style={index === 0 ? {} : {
                              // @ts-ignore
                              '--progress-color': primaryColor
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-default-500">
                          <span className="font-medium">{vehicle.year}</span>
                          <span>•</span>
                          <span className="capitalize">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-default-500">
                          <span className="capitalize">{vehicle.fuelType}</span>
                          <span>•</span>
                          <span>{vehicle.engine}</span>
                        </div>
                        {vehicle.mileage && (
                          <div className="text-xs text-default-500">
                            {vehicle.mileage.toLocaleString()} km
                          </div>
                        )}
                      </div>
                    </CardBody>
                    
                    {comparison && vehicle.bestCategories && vehicle.bestCategories.length > 0 && (
                      <CardFooter className="px-4 pb-4 pt-0">
                        <div className="flex flex-wrap gap-1.5">
                          {vehicle.bestCategories.slice(0, 2).map((cat, idx) => (
                            <Chip
                              key={`best-category-${vehicle.id}-${index}-${idx}-${cat.replace(/\s+/g, '-')}`}
                              size="sm"
                              variant="flat"
                              className="bg-green-50 text-green-700 border-green-200 text-xs font-medium"
                            >
                              {cat}
                            </Chip>
                          ))}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Comparison Table */}
        {comparison && selectedVehicles.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-8 border border-default-200">
              <CardHeader className="pb-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5" style={{ color: primaryColor }} />
                  Comparación Detallada
                </h3>
              </CardHeader>
              
              <CardBody className="pt-0">
                <ScrollShadow className="max-h-[600px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-default-200">
                        <th className="text-left p-4 font-medium text-sm text-default-600 uppercase tracking-wide">Categoría</th>
                        {comparison.vehicles.map((vehicle: ComparisonVehicle, index: number) => (
                          <th key={`header-${vehicle.id}-${index}`} className="text-center p-4">
                            <div className="flex flex-col items-center">
                              {index === 0 && (
                                <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center mb-2">
                                  <TrophyIcon className="w-4 h-4 text-warning" />
                                </div>
                              )}
                              <span className="font-medium text-sm text-foreground">
                                {vehicle.brand}
                              </span>
                              <span className="text-xs text-default-500">
                                {vehicle.model}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    
                    <tbody>
                      {categories.map((cat, catIndex) => {
                        // Find best value for this category
                        const values = comparison.vehicles.map((v: ComparisonVehicle) => cat.getValue(v));
                        const numericValues = values.filter((v: any) => typeof v === 'number') as number[];
                        
                        let bestValue: any;
                        if (numericValues.length > 0) {
                          bestValue = cat.higherIsBetter 
                            ? Math.max(...numericValues)
                            : Math.min(...numericValues);
                        }

                        return (
                          <tr key={`category-${catIndex}-${cat.category}`} className="border-b border-default-100 hover:bg-default-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-default-100 rounded-lg flex items-center justify-center">
                                  {cat.icon}
                                </div>
                                <span className="font-medium text-sm text-foreground">{cat.category}</span>
                              </div>
                            </td>
                            
                            {comparison.vehicles.map((vehicle: ComparisonVehicle, vehicleIndex: number) => {
                              const value = cat.getValue(vehicle);
                              const isBest = typeof value === 'number' && value === bestValue && numericValues.length > 1;
                              
                              return (
                                <td key={`${cat.category}-${vehicle.id}-${vehicleIndex}-${catIndex}`} className="text-center p-4">
                                  <div className={`inline-flex items-center gap-2 text-sm ${isBest ? 'font-semibold text-green-600' : 'text-foreground'}`}>
                                    {cat.format ? cat.format(value) : value}
                                    {isBest && (
                                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckIcon className="w-3 h-3 text-green-600" />
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </ScrollShadow>
              </CardBody>
            </Card>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comparison.vehicles.map((vehicle: ComparisonVehicle, index: number) => (
                <Card key={`pros-cons-${vehicle.id}`} className="h-full border border-default-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between w-full">
                      <h4 className="font-semibold text-sm text-foreground">{vehicle.brand} {vehicle.model}</h4>
                      {index === 0 && (
                        <Chip color="success" size="sm" variant="flat" className="text-xs">
                          Mejor Opción
                        </Chip>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardBody className="space-y-4 pt-0">
                    {vehicle.pros && vehicle.pros.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-success-600 dark:text-success-400 mb-2 uppercase tracking-wide">
                          Ventajas
                        </p>
                        <div className="space-y-2">
                          {vehicle.pros.map((pro, idx) => (
                            <div key={`pro-${vehicle.id}-${index}-${idx}`} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-success-500 rounded-full mt-1.5 flex-shrink-0" />
                              <span className="text-sm text-foreground/80 leading-relaxed">{pro}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {vehicle.cons && vehicle.cons.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-danger-600 dark:text-danger-400 mb-2 uppercase tracking-wide">
                          Desventajas
                        </p>
                        <div className="space-y-2">
                          {vehicle.cons.map((con, idx) => (
                            <div key={`con-${vehicle.id}-${index}-${idx}`} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-danger-500 rounded-full mt-1.5 flex-shrink-0" />
                              <span className="text-sm text-foreground/80 leading-relaxed">{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendation */}
        {comparison && comparison.winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="border border-success-200 bg-success-50/50 dark:bg-success-950/30 dark:border-success-800/30">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrophyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Recomendación</h3>
                    <p className="text-base text-foreground/80 mb-3 leading-relaxed">
                      Basado en la comparación, el <strong className="text-foreground">{comparison.winner.brand} {comparison.winner.model}</strong> es la mejor opción
                      con una puntuación del <strong className="text-success-600">{formatPercentage(comparison.winner.score)}%</strong>.
                    </p>
                    {comparison.winner.bestCategories && comparison.winner.bestCategories.length > 0 && (
                      <p className="text-sm text-foreground/60">
                        Destaca en: <span className="font-medium text-foreground/80">{comparison.winner.bestCategories.join(', ')}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Vehicle Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">Seleccionar Vehículo</h3>
          </ModalHeader>
          
          <ModalBody>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por marca o modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<SearchIcon className="w-4 h-4" />}
                  className="flex-1"
                />
                <Button
                  color="primary"
                  onClick={fetchVehicles}
                  isLoading={loading}
                >
                  Buscar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                {vehicles.map((vehicle) => {
                  const isSelected = selectedVehicleIds.has(vehicle.id);
                  
                  return (
                    <Card
                      key={vehicle.id}
                      isPressable
                      onPress={() => !isSelected && addToComparison(vehicle)}
                      className={`${isSelected ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
                    >
                      <CardBody className="flex flex-row gap-3">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={vehicle.imageUrl || vehicle.image || '/carro.png'}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-bold">{vehicle.brand} {vehicle.model}</h4>
                          <p className="text-sm text-default-500">{vehicle.year}</p>
                          <p className="text-lg font-semibold" style={{ color: primaryColor }}>
                            ${vehicle.price.toLocaleString()}
                          </p>

                          {isSelected && (
                            <Chip size="sm" color="success" variant="flat">
                              Seleccionado
                            </Chip>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="flat" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
};

export default CompararPage;