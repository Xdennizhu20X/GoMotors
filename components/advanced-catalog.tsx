'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Select, SelectItem, Input, Pagination } from '@heroui/react';
import { SearchIcon } from '@/components/icons';
import { VehicleCard } from '@/components/vehicle-card';
import { type Vehicle } from '@/config/vehicles';
import apiClient from '@/lib/api-client';
import { useDealerTheme } from '@/hooks/useDealerTheme';

type SortOption = 'relevance' | 'price-high' | 'price-low' | 'year-new' | 'year-old';
type ViewMode = 'cards' | 'list';

interface AdvancedCatalogProps {
  className?: string;
  dealerId?: string; // Add dealerId prop to filter by dealership
}

interface ApiVehicle extends Vehicle {
  status?: 'available' | 'sold' | 'reserved' | 'inactive';
  available?: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export const AdvancedCatalog = ({ className = '', dealerId }: AdvancedCatalogProps) => {
  const { primaryColor } = useDealerTheme();

  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [dealer, setDealer] = useState('');
  const [condition, setCondition] = useState('');
  
  // UI states
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  // API states
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  
  // Available options from API

  const sortOptions = [
    { key: 'relevance', label: 'Relevancia' },
    { key: 'price-high', label: 'Precio: Mayor a menor' },
    { key: 'price-low', label: 'Precio: Menor a mayor' },
    { key: 'year-new', label: 'Año: Más nuevo' },
    { key: 'year-old', label: 'Año: Más antiguo' },
  ];
  
  const conditionOptions = [
    { key: 'new', label: 'Nuevo' },
    { key: 'used', label: 'Usado' },
    { key: 'certified', label: 'Certificado' },
  ];

  const transmissionOptions = [
    { key: 'manual', label: 'Manual' },
    { key: 'automatica', label: 'Automática' },
    { key: 'cvt', label: 'CVT' },
  ];

  const fuelTypeOptions = [
    { key: 'gasolina', label: 'Gasolina' },
    { key: 'diesel', label: 'Diesel' },
    { key: 'hibrido', label: 'Híbrido' },
    { key: 'electrico', label: 'Eléctrico' },
  ];

  const dealerOptions = [
    { key: 'quito', label: 'Quito' },
    { key: 'guayaquil', label: 'Guayaquil' },
    { key: 'cuenca', label: 'Cuenca' },
  ];

  // API Functions
  const fetchVehicles = async (page = 1) => {
    try {
      setLoading(true);
      console.log('Attempting to fetch vehicles from API...');
      console.log('DealerId prop received:', dealerId);

      // Build query parameters exactly as specified: {{apiUrl}}/vehicles?page=1&limit=20&brand=Toyota&minPrice=15000&maxPrice=25000&condition=new&sortBy=price&sortOrder=asc
      const queryParams: any = {
        page,
        limit: pagination.itemsPerPage
      };

      // Add filters
      if (minPrice) queryParams.minPrice = minPrice;
      if (maxPrice) queryParams.maxPrice = maxPrice;
      if (transmission) queryParams.transmission = transmission;
      if (fuelType) queryParams.fuelType = fuelType;
      if (dealer) queryParams.location = dealer;
      if (condition) queryParams.condition = condition;

      // Filter by dealership if dealerId is provided
      if (dealerId) {
        queryParams.dealer = dealerId;
        console.log('Filtering vehicles by dealership:', dealerId);
      } else {
        console.warn('⚠️ No dealerId provided, fetching all vehicles');
      }

      console.log('Query params being sent:', queryParams);
      
      // Add sorting
      if (sortBy !== 'relevance') {
        switch (sortBy) {
          case 'price-high':
            queryParams.sortBy = 'price';
            queryParams.sortOrder = 'desc';
            break;
          case 'price-low':
            queryParams.sortBy = 'price';
            queryParams.sortOrder = 'asc';
            break;
          case 'year-new':
            queryParams.sortBy = 'year';
            queryParams.sortOrder = 'desc';
            break;
          case 'year-old':
            queryParams.sortBy = 'year';
            queryParams.sortOrder = 'asc';
            break;
        }
      }
      
      let vehiclesData = [];
      let paginationData = {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
      };
      
      try {
        console.log('Fetching vehicles with params:', queryParams);
        const response = await apiClient.getVehicles(queryParams);

        console.log('API Response:', response);

        // Check if response has the expected structure
        if (response && ((response as any).status === 'success' || response.success) && response.data) {
          // Handle API response structure: { success: true, data: { vehicles: [...], pagination: {...} } }
          if (response.data.vehicles && Array.isArray(response.data.vehicles)) {
            vehiclesData = response.data.vehicles;
            if (response.data.pagination) {
              paginationData = {
                currentPage: response.data.pagination.currentPage || page,
                totalPages: response.data.pagination.totalPages || 1,
                totalItems: response.data.pagination.totalItems || vehiclesData.length,
                itemsPerPage: response.data.pagination.itemsPerPage || 20
              };
            } else {
              paginationData.totalItems = vehiclesData.length;
            }
          } else if (Array.isArray(response.data)) {
            // Direct array response
            vehiclesData = response.data;
            paginationData.totalItems = vehiclesData.length;
          } else if (response.data && typeof response.data === 'object') {
            // Single vehicle object
            vehiclesData = [response.data];
            paginationData.totalItems = 1;
          } else {
            console.warn('Unexpected response structure, using empty array');
            vehiclesData = [];
            paginationData.totalItems = 0;
          }
          console.log('API vehicles loaded successfully:', vehiclesData.length, 'vehicles');
        } else if (response && response.success && response.data) {
          // Alternative response structure: { success: true, data: {...} }
          if (response.data.vehicles && Array.isArray(response.data.vehicles)) {
            vehiclesData = response.data.vehicles;
            if (response.data.pagination) {
              paginationData = {
                currentPage: response.data.pagination.currentPage || page,
                totalPages: response.data.pagination.totalPages || 1,
                totalItems: response.data.pagination.totalItems || vehiclesData.length,
                itemsPerPage: response.data.pagination.itemsPerPage || 20
              };
            }
          }
          console.log('API vehicles loaded (alternative structure):', vehiclesData.length, 'vehicles');
        } else {
          console.warn('API returned empty or invalid response:', response);
          vehiclesData = [];
          paginationData.totalItems = 0;
        }
      } catch (apiError: any) {
        console.error('API request failed:', apiError);
        // Set empty data instead of throwing
        vehiclesData = [];
        paginationData = {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20
        };
        // Don't re-throw, let the component handle empty state gracefully
      }
      
      // Normalize vehicles data to match expected format
      const normalizedVehicles = vehiclesData.map((vehicle: any) => ({
        ...vehicle,
        id: vehicle._id || vehicle.id,
        transmission: vehicle.transmission || 'manual',
        fuelType: vehicle.fuelType || 'gasolina',
        stock: vehicle.stock || (vehicle.status === 'available' ? 5 : 0),
        mileage: vehicle.mileage ?? 0,
        // Ensure imageUrl is available for VehicleCard
        imageUrl: vehicle.imageUrl || vehicle.images?.[0] || '/placeholder-vehicle.jpg'
      }));
      
      console.log(`Loaded ${normalizedVehicles.length} vehicles`);
      setVehicles(normalizedVehicles);
      setPagination(paginationData);


      setError(null);
      
    } catch (error: any) {
      console.error('Critical error in fetchVehicles:', error);
      setError(`Error de conexión: ${error.message || 'No se pudo conectar con el servidor'}`);
      setVehicles([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
      });
    } finally {
      setLoading(false);
    }
  };
  

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchVehicles(1);
  }, [dealerId, minPrice, maxPrice, transmission, fuelType, dealer, condition, sortBy]);

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setTransmission('');
    setFuelType('');
    setDealer('');
    setCondition('');
    setSortBy('relevance');
  };

  const hasActiveFilters = minPrice || maxPrice || transmission || fuelType || dealer || condition;

  return (
    <div className={`bg-white dark:bg-black min-h-screen py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {dealerId ? 'Catálogo de Vehículos' : 'Catálogo Avanzado de Vehículos'}
          </h1>
          <p className="text-foreground/70">
            {dealerId ? 'Explora todos los vehículos de este concesionario' : 'Explora nuestra colección completa con filtros avanzados'}
          </p>
        </motion.div>

        {/* Top Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700"
        >
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground/70">Ordenar por:</span>
            <Select
              selectedKeys={[sortBy]}
              onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as SortOption)}
              className="w-48"
              size="sm"
              placeholder="Seleccionar orden"
              aria-label="Ordenar vehículos"
            >
              {sortOptions.map((option) => (
                <SelectItem key={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground/70">Vista:</span>
            <div className="flex rounded-lg border border-gray-200 dark:border-neutral-600 overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'text-white'
                    : 'bg-white dark:bg-neutral-800 text-foreground hover:bg-gray-50 dark:hover:bg-neutral-700'
                }`}
                style={viewMode === 'cards' ? { backgroundColor: primaryColor } : {}}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'text-white'
                    : 'bg-white dark:bg-neutral-800 text-foreground hover:bg-gray-50 dark:hover:bg-neutral-700'
                }`}
                style={viewMode === 'list' ? { backgroundColor: primaryColor } : {}}
              >
                Lista
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="light"
                    size="sm"
                    style={{ color: primaryColor }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>

              <div className="space-y-6">

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rango de Precio
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      size="sm"
                      startContent={<span className="text-foreground/60 text-sm">$</span>}
                      aria-label="Precio mínimo"
                    />
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      size="sm"
                      startContent={<span className="text-foreground/60 text-sm">$</span>}
                      aria-label="Precio máximo"
                    />
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Transmisión
                  </label>
                  <Select
                    placeholder="Todas las transmisiones"
                    selectedKeys={transmission ? [transmission] : []}
                    onSelectionChange={(keys) => setTransmission(Array.from(keys)[0] as string || '')}
                    size="sm"
                    aria-label="Filtrar por tipo de transmisión"
                  >
                    {transmissionOptions.map((option) => (
  <SelectItem key={option.key}>
    {option.label}
  </SelectItem>
))}
                  </Select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tipo de Combustible
                  </label>
                  <Select
                    placeholder="Todos los combustibles"
                    selectedKeys={fuelType ? [fuelType] : []}
                    onSelectionChange={(keys) => setFuelType(Array.from(keys)[0] as string || '')}
                    size="sm"
                    aria-label="Filtrar por tipo de combustible"
                  >
                    {fuelTypeOptions.map((option) => (
  <SelectItem key={option.key}>
    {option.label}
  </SelectItem>
))}
                  </Select>
                </div>

                {/* Dealer Location */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Concesionario
                  </label>
                  <Select
                    placeholder="Todas las ubicaciones"
                    selectedKeys={dealer ? [dealer] : []}
                    onSelectionChange={(keys) => setDealer(Array.from(keys)[0] as string || '')}
                    size="sm"
                    aria-label="Filtrar por ubicación del concesionario"
                  >
                    {dealerOptions.map((option) => (
                      <SelectItem key={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Condición
                  </label>
                  <Select
                    placeholder="Todas las condiciones"
                    selectedKeys={condition ? [condition] : []}
                    onSelectionChange={(keys) => setCondition(Array.from(keys)[0] as string || '')}
                    size="sm"
                    aria-label="Filtrar por condición del vehículo"
                  >
                    {conditionOptions.map((option) => (
                      <SelectItem key={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Results */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1"
          >
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mr-4" style={{ borderBottomColor: primaryColor }}></div>
                <p className="text-foreground/70">Cargando vehículos...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Results Counter */}
            {!loading && !error && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-foreground/70">
                  {pagination.totalItems} vehículo{pagination.totalItems !== 1 ? 's' : ''} encontrado{pagination.totalItems !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && vehicles.length > 0 ? (
              <>
                <motion.div
                  key={`${vehicles.length}-${viewMode}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={
                    viewMode === 'cards'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {vehicles.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      index={index}
                    />
                  ))}
                </motion.div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      total={pagination.totalPages}
                      page={pagination.currentPage}
                      onChange={(page) => fetchVehicles(page)}
                      showControls
                      className="gap-2"
                      aria-label="Navegación de páginas de vehículos"
                    />
                  </div>
                )}
              </>
            ) : !loading && !error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-12 h-12 text-gray-400 dark:text-neutral-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No se encontraron vehículos
                </h3>
                <p className="text-foreground/60 max-w-md mx-auto mb-6">
                  Intenta ajustar tus filtros para encontrar vehículos que se adapten a tus necesidades.
                </p>
                <Button
                  onClick={clearFilters}
                  variant="bordered"
                  style={{
                    borderColor: primaryColor,
                    color: primaryColor
                  }}
                >
                  Limpiar todos los filtros
                </Button>
              </motion.div>
            ) : null}
          </motion.main>
        </div>
      </div>
    </div>
  );
};