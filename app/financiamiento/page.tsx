'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Select, SelectItem, Slider, Card, CardBody } from '@heroui/react';
import { useDealerTheme } from '@/hooks/useDealerTheme';

interface FinancialEntity {
  id: string;
  name: string;
  tea: number; // Tasa Efectiva Anual
}

interface CalculationResult {
  monthlyPayment: number;
  financedAmount: number;
  tea: number;
  totalInterest: number;
  totalToPay: number;
  entity: FinancialEntity;
}

const FinanciamientoPage = () => {
  const { primaryColor } = useDealerTheme();

  const [vehiclePrice, setVehiclePrice] = useState<number>(25000);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(20);
  const [selectedEntity, setSelectedEntity] = useState<string>('pichincha');
  const [termMonths, setTermMonths] = useState<number>(36);

  const financialEntities: FinancialEntity[] = [
    { id: 'pichincha', name: 'Banco Pichincha', tea: 18.5 },
    { id: 'loja', name: 'Banco de Loja', tea: 16.8 },
    { id: 'coopmego', name: 'Coopmego', tea: 15.2 },
  ];

  const termOptions = [
    { key: '12', label: '12 meses (1 año)' },
    { key: '24', label: '24 meses (2 años)' },
    { key: '36', label: '36 meses (3 años)' },
    { key: '48', label: '48 meses (4 años)' },
    { key: '60', label: '60 meses (5 años)' },
  ];

  // Calcular resultados
  const calculateFinancing = (entity: FinancialEntity): CalculationResult => {
    const downPayment = (vehiclePrice * downPaymentPercentage) / 100;
    const financedAmount = vehiclePrice - downPayment;
    const monthlyRate = entity.tea / 100 / 12;
    
    // Fórmula de cuota mensual
    const monthlyPayment = financedAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    const totalToPay = monthlyPayment * termMonths;
    const totalInterest = totalToPay - financedAmount;

    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      financedAmount,
      tea: entity.tea,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      totalToPay: isNaN(totalToPay) ? 0 : totalToPay,
      entity
    };
  };

  const selectedEntityData = financialEntities.find(e => e.id === selectedEntity) || financialEntities[0];
  const primaryResult = calculateFinancing(selectedEntityData);
  const comparisonResults = financialEntities
    .filter(e => e.id !== selectedEntity)
    .map(e => calculateFinancing(e));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3,
      },
    },
  };

  const resultsVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.5,
      },
    },
  };

  return (
    <main className="relative min-h-screen bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at 30% 20%, ${primaryColor}0f, transparent 60%)`
      }}></div>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at 70% 80%, ${primaryColor}0a, transparent 50%)`
      }}></div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-15, 15, -15],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 left-16 w-24 h-24 rounded-full blur-xl"
        style={{ backgroundColor: `${primaryColor}14` }}
      ></motion.div>

      <motion.div
        animate={{
          y: [15, -15, 15],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-40 right-20 w-32 h-32 rounded-full blur-xl"
        style={{ backgroundColor: `${primaryColor}0f` }}
      ></motion.div>

      <div className="relative z-10 py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-6">
              <span className="text-foreground">Simulador de </span>
              <span style={{ color: primaryColor }}>Financiamiento</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-light max-w-3xl mx-auto">
              Calcula tu cuota mensual y encuentra la mejor opción de financiamiento para tu
              <span className="font-semibold" style={{ color: primaryColor }}> vehículo ideal</span>.
            </p>
          </motion.div>

          {/* Calculator */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Form - Left Side */}
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="p-4 lg:p-6 shadow-xl border border-gray-200/50 dark:border-neutral-700">
                <CardBody className="space-y-5">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Datos del Financiamiento
                  </h2>

                  {/* Vehicle Price */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-2">
                      Precio del Vehículo
                    </label>
                    <Input
                      type="number"
                      value={vehiclePrice.toString()}
                      onChange={(e) => setVehiclePrice(Number(e.target.value) || 0)}
                      startContent={<span className="text-foreground/60">$</span>}
                      size="md"
                    />
                  </div>

                  {/* Down Payment */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-2">
                      Cuota Inicial ({downPaymentPercentage}% - {formatCurrency((vehiclePrice * downPaymentPercentage) / 100)})
                    </label>
                    <Slider
                      value={downPaymentPercentage}
                      onChange={(value) => setDownPaymentPercentage(value as number)}
                      minValue={10}
                      maxValue={50}
                      step={5}
                      className="w-full"
                      color="primary"
                      showSteps
                      marks={[
                        { value: 10, label: "10%" },
                        { value: 20, label: "20%" },
                        { value: 30, label: "30%" },
                        { value: 40, label: "40%" },
                        { value: 50, label: "50%" },
                      ]}
                    />
                  </div>

                  {/* Financial Entity */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-2">
                      Entidad Financiera
                    </label>
                    <Select
                      selectedKeys={selectedEntity ? [selectedEntity] : []}
                      onSelectionChange={(keys) => setSelectedEntity(Array.from(keys)[0] as string)}
                      size="md"
                      placeholder="Selecciona una entidad"
                      color='primary'
                    >
                      {financialEntities.map((entity) => (
                        <SelectItem key={entity.id}>
                          {entity.name} - TEA: {entity.tea}%
                        </SelectItem>

                      ))}
                    </Select>
                  </div>

                  {/* Term */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-2">
                      Plazo de Financiamiento
                    </label>
                    <Select
                      selectedKeys={termMonths ? [termMonths.toString()] : []}
                      onSelectionChange={(keys) => setTermMonths(Number(Array.from(keys)[0]))}
                      size="md"
                      placeholder="Selecciona el plazo"
                    >
                      {termOptions.map((option) => (
                        <SelectItem key={option.key}>
                        {option.label}
                      </SelectItem>
                      ))}
                    </Select>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Results - Right Side */}
            <motion.div
              variants={resultsVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Main Results */}
              <Card
                className="p-4 lg:p-6 shadow-xl border border-gray-200/50 dark:border-neutral-700"
                style={{
                  background: `linear-gradient(to bottom right, ${primaryColor}0d, transparent)`
                }}
              >
                <CardBody>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      Resultado del Cálculo
                    </h3>
                    <div
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${primaryColor}33` }}
                    >
                      <span className="text-sm font-medium" style={{ color: primaryColor }}>
                        {selectedEntityData.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div
                      className="text-center p-3 rounded-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <p className="text-white/80 text-sm uppercase tracking-wide">Cuota Mensual</p>
                      <p className="text-2xl font-black text-white">
                        {formatCurrency(primaryResult.monthlyPayment)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Monto Financiado</p>
                        <p className="text-base font-bold text-foreground">{formatCurrency(primaryResult.financedAmount)}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">TEA</p>
                        <p className="text-base font-bold text-foreground">{primaryResult.tea}%</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Total Intereses</p>
                        <p className="text-base font-bold text-foreground">{formatCurrency(primaryResult.totalInterest)}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Total a Pagar</p>
                        <p className="text-base font-bold text-foreground">{formatCurrency(primaryResult.totalToPay)}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Desglose de Pagos</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Cuota inicial:</span>
                          <span className="font-medium">{formatCurrency((vehiclePrice * downPaymentPercentage) / 100)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Financiado:</span>
                          <span className="font-medium">{formatCurrency(primaryResult.financedAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">{termMonths} cuotas de:</span>
                          <span className="font-medium">{formatCurrency(primaryResult.monthlyPayment)}</span>
                        </div>
                        <hr className="my-2 border-gray-300 dark:border-neutral-600" />
                        <div className="flex justify-between font-semibold">
                          <span>Total del vehículo:</span>
                          <span style={{ color: primaryColor }}>{formatCurrency(vehiclePrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Comparison */}
              <Card className="p-4 lg:p-6 shadow-xl border border-gray-200/50 dark:border-neutral-700">
                <CardBody>
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Comparar con Otros Bancos
                  </h3>
                  
                  <div className="space-y-4">
                    {comparisonResults.map((result, index) => (
                      <motion.div
                        key={result.entity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="p-4 border border-gray-200 dark:border-neutral-600 rounded-lg transition-colors"
                        style={{
                          // @ts-ignore
                          '--hover-border-color': `${primaryColor}4d`
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{result.entity.name}</h4>
                            <p className="text-sm text-foreground/60">TEA: {result.entity.tea}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold" style={{ color: primaryColor }}>
                              {formatCurrency(result.monthlyPayment)}
                            </p>
                            <p className="text-xs text-foreground/60">por mes</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-foreground/60">Total intereses: </span>
                            <span className="font-medium">{formatCurrency(result.totalInterest)}</span>
                          </div>
                          <div>
                            <span className="text-foreground/60">Total a pagar: </span>
                            <span className="font-medium">{formatCurrency(result.totalToPay)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className={`text-sm flex items-center gap-2 ${
                            result.monthlyPayment < primaryResult.monthlyPayment 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {result.monthlyPayment < primaryResult.monthlyPayment ? '↓' : '↑'}
                            {result.monthlyPayment < primaryResult.monthlyPayment 
                              ? `Ahorras ${formatCurrency(primaryResult.monthlyPayment - result.monthlyPayment)} al mes`
                              : `Pagas ${formatCurrency(result.monthlyPayment - primaryResult.monthlyPayment)} más al mes`
                            }
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FinanciamientoPage;