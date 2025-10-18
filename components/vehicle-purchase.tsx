"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Select, SelectItem, Input, Radio, RadioGroup, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { type Vehicle } from '@/config/vehicles'
import apiClient from '@/lib/api-client'
import {
  trackPurchase,
  trackVehicleInteraction,
  trackFinancingInteraction,
  trackUserEngagement
} from '@/lib/analytics'
import { FinancingModalMultiStep } from './financing-modal-multi-step'

interface VehiclePurchaseProps {
  vehicle: Vehicle
  selectedColor: string
  onColorChange: (color: string) => void
}

interface PaymentFormData {
  // Datos personales
  firstName: string
  lastName: string
  email: string
  phone: string
  postalCode: string
  
  // Datos de la tarjeta (si aplica)
  cardNumber: string
  expiryYear: string
  expiryMonth: string
  securityCode: string

  // Datos para financiamiento
  monthlyIncome: string
  workplace: string
  jobTime: string
  contractType: string
}

export const VehiclePurchase = ({ vehicle, selectedColor, onColorChange }: VehiclePurchaseProps) => {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'financing'>('cash')
  const [selectedBank, setSelectedBank] = useState('')
  const [downPayment, setDownPayment] = useState(5000)
  const [loanTerms, setLoanTerms] = useState(36)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isFinancingModalOpen, onOpen: onFinancingModalOpen, onOpenChange: onFinancingModalChange } = useDisclosure()
  const { isOpen: isAuthModalOpen, onOpen: onAuthModalOpen, onOpenChange: onAuthModalChange } = useDisclosure()
  const { isOpen: isSuccessModalOpen, onOpen: onSuccessModalOpen, onOpenChange: onSuccessModalChange } = useDisclosure()

  // Loading and error states
  const [isCreatingPurchase, setIsCreatingPurchase] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [currentPurchaseId, setCurrentPurchaseId] = useState<string | null>(null)
  const [confirmationData, setConfirmationData] = useState<any>(null)

  const [formData, setFormData] = useState<PaymentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postalCode: '',
    cardNumber: '',
    expiryYear: '',
    expiryMonth: '',
    securityCode: '',
    monthlyIncome: '',
    workplace: '',
    jobTime: '',
    contractType: ''
  })

  // Prellenar formulario con datos del usuario cuando esté disponible
  useEffect(() => {
    if (user && isAuthenticated) {
      const nameParts = user.name?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, isAuthenticated]);

  // Función para obtener código hex basado en el nombre del color
  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Blanco': '#FFFFFF',
      'Blanco Perla': '#F8F9FA',
      'Negro': '#000000',
      'Negro Metalizado': '#1C1C1E',
      'Gris': '#6B7280',
      'Gris Perlado': '#8E8E93',
      'Plata': '#C0C0C0',
      'Plata Metalizado': '#C7C7CC',
      'Azul': '#007AFF',
      'Azul Metalizado': '#007AFF',
      'Rojo': '#FF3B30',
      'Rojo Metalizado': '#FF3B30',
      'Dorado': '#FF9500',
      'Dorado Metalizado': '#FF9500',
      'Verde': '#34C759',
      'Verde Metalizado': '#34C759'
    }
    
    // Buscar coincidencia exacta o parcial
    for (const [key, hex] of Object.entries(colorMap)) {
      if (colorName.toLowerCase().includes(key.toLowerCase())) {
        return hex
      }
    }
    
    // Color por defecto si no se encuentra
    return '#6B7280'
  }

  // Colores disponibles (SOLO los que devuelve el backend)
  const getAvailableColors = () => {
    // Si la API devuelve colores específicos, úsalos ÚNICAMENTE
    if ((vehicle as any).availableColors && (vehicle as any).availableColors.length > 0) {
      console.log('Using backend colors:', (vehicle as any).availableColors)
      return (vehicle as any).availableColors
        .filter((apiColor: any) => apiColor.available !== false) // Solo colores disponibles
        .map((apiColor: any) => ({
          name: apiColor.name,
          value: apiColor.value || apiColor.name,
          color: apiColor.hexCode || apiColor.hex || getColorHex(apiColor.name),
          available: apiColor.available,
          image: apiColor.image // Imagen del vehículo en este color
        }))
    }

    // Si NO hay colores del backend, mostrar solo el color actual del vehículo
    console.log('No backend colors found, using vehicle color:', vehicle.color)
    const currentColor = vehicle.color || 'Blanco'
    return [
      {
        name: currentColor,
        value: currentColor,
        color: getColorHex(currentColor)
      }
    ]
  }

  const availableColors = getAvailableColors()

  // Obtener el color seleccionado completo
  const selectedColorObj = availableColors.find((c: any) =>
    c.name === selectedColor || c.value === selectedColor
  )

  const banks = [
    { key: 'pichincha', label: 'Banco Pichincha' },
    { key: 'pacifico', label: 'Banco del Pacífico' },
    { key: 'guayaquil', label: 'Banco de Guayaquil' },
    { key: 'loja', label: 'Banco de Loja' }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateMonthlyPayment = () => {
    const loanAmount = vehicle.price - downPayment
    const monthlyRate = 0.085 / 12 // 8.5% anual
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerms)) / 
                   (Math.pow(1 + monthlyRate, loanTerms) - 1)
    return payment
  }

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePurchaseClick = async () => {
    console.log('Purchase click - Auth state:', {
      isAuthenticated,
      user,
      userExists: !!user
    });

    // Track purchase initiation
    trackVehicleInteraction('purchase_initiated', {
      vehicle_id: vehicle.id || (vehicle as any)._id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      dealer_id: (vehicle as any).dealer?._id || (vehicle as any).dealer || (vehicle as any).dealerId,
    });

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      console.log('User not authenticated, showing auth modal');
      trackUserEngagement({
        action: 'click',
        element: 'purchase_button_unauthenticated',
        additional_data: { requires_auth: true }
      });
      onAuthModalOpen()
      return
    }

    // Track authenticated purchase start
    trackUserEngagement({
      action: 'click',
      element: 'purchase_button_authenticated',
      additional_data: { user_authenticated: true }
    });

    // Si está autenticado, crear la compra primero y luego abrir modal
    console.log('User authenticated, creating purchase first...');
    try {
      await createPurchase()
      // Si llegamos aquí sin error, abrir el modal correspondiente
      if (paymentMethod === 'financing') {
        onFinancingModalOpen()
      } else {
        onOpen()
      }
    } catch (error) {
      console.error('Failed to create purchase:', error)
      // El error ya está manejado en createPurchase mediante setPurchaseError
    }
  }

  const handleAuthRedirect = () => {
    // Redirigir a página de auth con redirect de vuelta
    const currentPath = window.location.pathname
    router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`)
  }

  const createPurchase = async () => {
    if (!user) return

    setIsCreatingPurchase(true)
    setPurchaseError(null)

    try {
      // Verificar si es usuario de NextAuth sin token backend
      const backendToken = localStorage.getItem('authToken');
      if (!backendToken) {
        console.log('No backend token found - user may be OAuth only');
        // Intentar usar el token OAuth del backend si está disponible
        const oauthToken = localStorage.getItem('oauth_backend_token');
        if (oauthToken) {
          console.log('Using OAuth backend token for purchase');
          localStorage.setItem('authToken', oauthToken);
        } else {
          console.log('No backend tokens available - simulating purchase creation');
          const simulatedId = 'nextauth-' + Date.now();
          setCurrentPurchaseId(simulatedId);
          return simulatedId;
        }
      }
      const financingDetails = paymentMethod === 'financing' ? {
        downPayment,
        loanAmount: vehicle.price - downPayment,
        loanTerms,
        monthlyPayment: calculateMonthlyPayment(),
        interestRate: 8.5,
        totalInterest: (calculateMonthlyPayment() * loanTerms) - (vehicle.price - downPayment),
        totalAmount: calculateMonthlyPayment() * loanTerms + downPayment,
        monthlyIncome: formData.monthlyIncome,
        workplace: formData.workplace,
        jobTime: formData.jobTime,
        contractType: formData.contractType
      } : undefined

      // Validar que tenemos IDs válidos antes de enviar
      const vehicleId = vehicle.id || (vehicle as any)._id;

      // Extraer dealerId correctamente - puede ser un string directo o un objeto con _id
      const dealerId = (vehicle as any).dealer?._id ||
                       (vehicle as any).dealer ||
                       (vehicle as any).dealerId ||
                       null;

      if (!vehicleId) {
        throw new Error('ID de vehículo no válido');
      }

      // Extraer información del dealer con valores por defecto mejorados
      const dealerName = (vehicle as any).dealer?.name ||
                        (vehicle as any).dealerName ||
                        `${vehicle.brand} ${vehicle.location || 'Ecuador'}`;

      const dealerLocation = (vehicle as any).dealer?.location ||
                             (vehicle as any).dealerLocation ||
                             vehicle.location ||
                             'Ecuador';

      const purchaseData: any = {
        vehicleId,
        vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
        vehiclePrice: vehicle.price,
        selectedColor,
        dealerName,
        dealerLocation,
        paymentMethod,
        totalPrice: vehicle.price,
        purchaseDate: new Date().toISOString()
      }

      // Solo incluir dealerId si tiene un valor válido (no null ni undefined)
      if (dealerId && dealerId !== null && dealerId !== undefined) {
        purchaseData.dealerId = dealerId;
      }

      // Solo incluir financingDetails si existe
      if (financingDetails) {
        purchaseData.financingDetails = financingDetails;
      }

      console.log('User data for purchase:', user)
      console.log('Vehicle data structure:', vehicle)
      console.log('Extracted vehicleId:', vehicleId)
      console.log('Extracted dealerId:', dealerId)
      console.log('Extracted dealerName:', dealerName)
      console.log('Extracted dealerLocation:', dealerLocation)
      console.log('Creating purchase with data:', purchaseData)

      const response = await apiClient.createPurchase(purchaseData)

      if (response.success && response.data?.purchaseId) {
        setCurrentPurchaseId(response.data.purchaseId)
        console.log('Purchase created successfully:', response.data)
        // Continuar con el formulario de facturación
        return response.data.purchaseId
      } else {
        throw new Error('No se recibió ID de compra')
      }
    } catch (error: any) {
      console.error('Error creating purchase:', error)
      setPurchaseError(
        error?.error?.message ||
        'Error al crear la compra. Por favor intenta nuevamente.'
      )
      throw error // Re-lanzar el error para que handlePurchaseClick lo pueda capturar
    } finally {
      setIsCreatingPurchase(false)
    }
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setPurchaseError('El nombre es requerido')
      return false
    }
    if (!formData.lastName.trim()) {
      setPurchaseError('El apellido es requerido')
      return false
    }
    if (!formData.email.trim()) {
      setPurchaseError('El email es requerido')
      return false
    }
    if (!formData.phone.trim()) {
      setPurchaseError('El teléfono es requerido')
      return false
    }
    if (!formData.postalCode.trim()) {
      setPurchaseError('El código postal es requerido')
      return false
    }

    if (paymentMethod === 'cash') {
      if (!formData.cardNumber.trim()) {
        setPurchaseError('El número de tarjeta es requerido')
        return false
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        setPurchaseError('La fecha de vencimiento es requerida')
        return false
      }
      if (!formData.securityCode.trim()) {
        setPurchaseError('El CVV es requerido')
        return false
      }
    }

    if (paymentMethod === 'financing') {
      if (!formData.monthlyIncome.trim()) {
        setPurchaseError('Los ingresos mensuales son requeridos')
        return false
      }
      if (!formData.workplace.trim()) {
        setPurchaseError('El lugar de trabajo es requerido')
        return false
      }
      if (!formData.jobTime.trim()) {
        setPurchaseError('El tiempo en el trabajo actual es requerido')
        return false
      }
      if (!formData.contractType.trim()) {
        setPurchaseError('El tipo de contrato es requerido')
        return false
      }
      if (!selectedBank) {
        setPurchaseError('Selecciona un banco para el financiamiento')
        return false
      }
    }

    return true
  }

  const processBilling = async () => {
    if (!validateForm()) {
      return
    }

    setIsProcessingPayment(true)
    setPurchaseError(null)

    try {
      // La compra ya debe haberse creado cuando se abrió el modal
      const purchaseId = currentPurchaseId;
      if (!purchaseId) {
        console.log('No purchase ID found - this should not happen');
        throw new Error('Error: No se encontró ID de compra. Por favor, intenta nuevamente.')
      }

      // Si es usuario de NextAuth, simular el procesamiento
      if (purchaseId.startsWith('nextauth-')) {
        console.log('Simulating billing for NextAuth user');
        // Simular respuesta exitosa
        const simulatedResponse = {
          billId: 'bill_' + Date.now(),
          purchaseId: purchaseId,
          status: 'completed',
          paymentStatus: 'approved',
          transactionId: 'txn_nextauth_' + Date.now(),
          confirmationCode: 'RY-NEXTAUTH-' + Date.now().toString().slice(-6),
          receiptNumber: 'RECEIPT-' + Date.now(),
          message: 'Compra completada exitosamente'
        };

        setConfirmationData(simulatedResponse);
        onOpenChange(); // Cerrar modal de facturación
        onSuccessModalOpen(); // Abrir modal de éxito
        return;
      }
      const billingData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        postalCode: formData.postalCode,
        paymentType: (paymentMethod === 'cash' ? 'card' : 'bank_transfer') as 'card' | 'bank_transfer',
        ...(paymentMethod === 'cash' && {
          cardDetails: {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            cvv: formData.securityCode
          }
        }),
        ...(paymentMethod === 'financing' && {
          bankDetails: {
            selectedBank,
            accountType: 'savings'
          },
          financialInfo: {
            monthlyIncome: formData.monthlyIncome,
            workplace: formData.workplace,
            jobTime: formData.jobTime,
            contractType: formData.contractType
          }
        }),
        savePaymentInfo: true,
        receiveNotifications: true
      }

      console.log('Processing billing with data:', billingData)

      const response = await apiClient.processBilling(purchaseId, billingData)

      if (response.success && response.data) {
        setConfirmationData(response.data)

        // Track successful purchase completion
        trackPurchase({
          transaction_id: response.data.transactionId || purchaseId,
          value: vehicle.price,
          currency: 'USD',
          items: [{
            item_id: vehicle.id || (vehicle as any)._id,
            item_name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
            item_category: 'vehicle',
            item_brand: vehicle.brand,
            price: vehicle.price,
            quantity: 1,
          }],
          payment_method: paymentMethod,
          dealer_id: (vehicle as any).dealer?._id || (vehicle as any).dealer || (vehicle as any).dealerId,
          dealer_name: (vehicle as any).dealer?.name || (vehicle as any).dealerName,
        });

        trackVehicleInteraction('purchase_completed', {
          vehicle_id: vehicle.id || (vehicle as any)._id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          dealer_id: (vehicle as any).dealer?._id || (vehicle as any).dealer || (vehicle as any).dealerId,
        });

        onOpenChange() // Cerrar modal de facturación
        onSuccessModalOpen() // Abrir modal de éxito
        console.log('Billing processed successfully:', response.data)
      } else {
        throw new Error('Error al procesar el pago')
      }
    } catch (error: any) {
      console.error('Error processing billing:', error)
      setPurchaseError(
        error?.error?.message ||
        'Error al procesar el pago. Por favor intenta nuevamente.'
      )
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const processFinancing = async (financingData: any) => {
    setIsProcessingPayment(true)
    setPurchaseError(null)

    try {
      const purchaseId = currentPurchaseId;
      if (!purchaseId) {
        throw new Error('Error: No se encontró ID de compra. Por favor, intenta nuevamente.')
      }

      const accountTypeMapping: { [key: string]: string } = {
        ahorros: 'savings',
        corriente: 'checking',
        ninguna: 'none'
      }

      // Preparar datos de billing con toda la información de financiamiento
      const billingData = {
        firstName: financingData.firstName,
        lastName: financingData.lastName,
        email: financingData.email,
        phone: financingData.phone,
        postalCode: financingData.postalCode,
        paymentType: 'bank_transfer' as const,
        bankDetails: {
          selectedBank: financingData.bankName,
          accountType: accountTypeMapping[financingData.accountType] || financingData.accountType
        },
        financingApplication: {
          employmentStatus: financingData.employmentStatus,
          employerName: financingData.employerName,
          occupation: financingData.occupation,
          timeInCurrentJob: parseInt(financingData.timeInCurrentJob) || 0,
          monthlyIncome: parseFloat(financingData.monthlyIncome) || 0,
          additionalIncome: parseFloat(financingData.additionalIncome) || 0,
          additionalIncomeSource: financingData.additionalIncomeSource,
          housingType: financingData.housingType,
          monthlyHousingCost: parseFloat(financingData.monthlyHousingCost) || 0,
          hasActiveDebts: financingData.hasActiveDebts,
          totalMonthlyDebts: parseFloat(financingData.totalMonthlyDebts) || 0,
          timeAsCustomer: parseInt(financingData.timeAsCustomer) || 0,
          personalReferences: financingData.personalReferences,
          identificationNumber: financingData.identificationNumber,
          maritalStatus: financingData.maritalStatus,
          numberOfDependents: parseInt(financingData.numberOfDependents) || 0,
          hasCurrentVehicle: financingData.hasCurrentVehicle,
          currentVehicleDetails: financingData.currentVehicleDetails,
          hasPreviousVehicleFinancing: financingData.hasPreviousVehicleFinancing,
          vehiclePurpose: financingData.vehiclePurpose,
          authorizeCreditCheck: financingData.authorizeCreditCheck,
          authorizeInformationVerification: financingData.authorizeInformationVerification,
          acceptTermsAndConditions: financingData.acceptTermsAndConditions
        },
        savePaymentInfo: true,
        receiveNotifications: true
      }

      console.log('Processing financing with data:', billingData)

      const response = await apiClient.processBilling(purchaseId, billingData)

      if (response.success && response.data) {
        setConfirmationData(response.data)

        // Track successful financing
        trackPurchase({
          transaction_id: response.data.transactionId || purchaseId,
          value: vehicle.price,
          currency: 'USD',
          items: [{
            item_id: vehicle.id || (vehicle as any)._id,
            item_name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
            item_category: 'vehicle',
            item_brand: vehicle.brand,
            price: vehicle.price,
            quantity: 1,
          }],
          payment_method: 'financing',
          dealer_id: (vehicle as any).dealer?._id || (vehicle as any).dealer || (vehicle as any).dealerId,
          dealer_name: (vehicle as any).dealer?.name || (vehicle as any).dealerName,
        });

        onFinancingModalChange() // Cerrar modal de financiamiento
        onSuccessModalOpen() // Abrir modal de éxito
        console.log('Financing processed successfully:', response.data)
      } else {
        throw new Error('Error al procesar la solicitud de financiamiento')
      }
    } catch (error: any) {
      console.error('Error processing financing:', error)
      setPurchaseError(
        error?.error?.message ||
        'Error al procesar la solicitud. Por favor intenta nuevamente.'
      )
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Selector de color */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecciona el color
        </h3>

        {/* Imagen del color seleccionado */}
        {selectedColorObj?.image && (
          <motion.div
            key={selectedColor}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#1341ee] shadow-lg"
          >
            <img
              src={selectedColorObj.image}
              alt={`${vehicle.brand} ${vehicle.model} - ${selectedColorObj.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {selectedColorObj.name}
            </div>

            {/* AI disclaimer para imágenes de colores */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white/80 px-2 py-1 rounded text-xs max-w-[180px] text-right">
              Generadas con IA y son parecidas pero no como lo original
            </div>
          </motion.div>
        )}

        <div className="flex flex-wrap gap-3">
          {availableColors.map((color: any) => {
            const isAvailable = color.available !== false // Si no tiene el campo, asumimos disponible
            const isSelected = selectedColor === color.value || selectedColor === color.name
            
            return (
              <motion.button
                key={color.value}
                className={`relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-[#1341ee] bg-blue-50 dark:bg-blue-950'
                    : isAvailable 
                      ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                } ${!isAvailable ? 'grayscale' : ''}`}
                onClick={() => isAvailable && onColorChange(color.name)}
                disabled={!isAvailable}
                whileHover={isAvailable ? { scale: 1.02 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300 relative"
                  style={{ backgroundColor: color.color }}
                >
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✕</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium">{color.name}</span>
                  {!isAvailable && (
                    <div className="text-xs text-gray-500">No disponible</div>
                  )}
                </div>
                {isSelected && isAvailable && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#1341ee] rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      <Divider />

      {/* Método de pago */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Método de pago
        </h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => {
            const newPaymentMethod = value as 'cash' | 'financing';
            setPaymentMethod(newPaymentMethod);

            // Track payment method selection
            trackVehicleInteraction('payment_method_selected', {
              vehicle_id: vehicle.id || (vehicle as any)._id,
              brand: vehicle.brand,
              model: vehicle.model,
              year: vehicle.year,
              price: vehicle.price,
              dealer_id: (vehicle as any).dealer?._id || (vehicle as any).dealer || (vehicle as any).dealerId,
            });

            trackUserEngagement({
              action: 'form_interaction',
              element: 'payment_method_selection',
              additional_data: {
                payment_method: newPaymentMethod,
                vehicle_price: vehicle.price
              }
            });
          }}
          className="space-y-3"
        >
          <Radio value="cash" className="text-gray-900 dark:text-white">
            Pago completo ({formatPrice(vehicle.price)})
          </Radio>
          <Radio value="financing" className="text-gray-900 dark:text-white">
            Financiamiento
          </Radio>
        </RadioGroup>

        {/* Opciones de financiamiento */}
        {paymentMethod === 'financing' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cuota inicial: {formatPrice(downPayment)} ({((downPayment / vehicle.price) * 100).toFixed(1)}%)
                </label>
                <input
                  type="range"
                  min={vehicle.price * 0.1}
                  max={vehicle.price * 0.5}
                  step="1000"
                  value={downPayment}
                  onChange={(e) => {
                    const newDownPayment = Number(e.target.value);
                    setDownPayment(newDownPayment);

                    // Track financing parameter changes
                    trackFinancingInteraction('down_payment_changed', {
                      loan_amount: vehicle.price - newDownPayment,
                      down_payment: newDownPayment,
                      loan_terms: loanTerms,
                      monthly_payment: calculateMonthlyPayment(),
                      vehicle_id: vehicle.id || (vehicle as any)._id,
                    });
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plazo de financiamiento
                </label>
                <Select
                  value={loanTerms.toString()}
                  onChange={(e) => setLoanTerms(Number(e.target.value))}
                  className="w-full"
                >
                  <SelectItem key="12">12 meses</SelectItem>
                  <SelectItem key="24">24 meses</SelectItem>
                  <SelectItem key="36">36 meses</SelectItem>
                  <SelectItem key="48">48 meses</SelectItem>
                  <SelectItem key="60">60 meses</SelectItem>
                </Select>
              </div>

              <div className="bg-white dark:bg-neutral-800 p-3 rounded border dark:border-neutral-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-white">Cuota mensual:</span>
                  <span className="text-lg font-bold text-[#1341ee]">
                    {formatPrice(calculateMonthlyPayment())}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Tasa de interés: 8.5% anual
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Divider />

      {/* Botón de compra */}
      <div className="space-y-3">
        <Button
          className="w-full bg-[#1341ee] text-white font-semibold py-3 text-lg"
          size="lg"
          onPress={handlePurchaseClick}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm opacity-90">
              {paymentMethod === 'cash' ? 'Comprar Ahora' : 'Financiar Vehículo'}
            </span>
            <span className="text-lg font-bold">
              {paymentMethod === 'cash' 
                ? formatPrice(vehicle.price)
                : `${formatPrice(calculateMonthlyPayment())}/mes`
              }
            </span>
          </div>
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          Al continuar, aceptas nuestros términos y condiciones de venta
        </p>
      </div>

      {/* Modal de formulario de pago */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          body: "overflow-y-auto"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">Información de pago</h3>
                <p className="text-sm text-gray-500">
                  {vehicle.brand} {vehicle.model} - Color: {selectedColor}
                </p>
              </ModalHeader>
              <ModalBody className="py-4">
                {/* Error de compra */}
                {purchaseError && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="text-red-700 dark:text-red-400 text-sm">{purchaseError}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Información personal */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Información personal</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Nombre"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        isRequired
                      />
                      <Input
                        label="Apellido"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        isRequired
                      />
                    </div>
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      isRequired
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Teléfono"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        isRequired
                      />
                      <Input
                        label="Código postal"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        isRequired
                      />
                    </div>
                  </div>

                  {/* Método de pago específico */}
                  {paymentMethod === 'cash' && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Información de la tarjeta</h4>
                      <Input
                        label="Número de tarjeta"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        isRequired
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <Select
                          label="Mes"
                          value={formData.expiryMonth}
                          onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          label="Año"
                          value={formData.expiryYear}
                          onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                        >
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={String(new Date().getFullYear() + i)}>
                              {String(new Date().getFullYear() + i)}
                            </SelectItem>
                          ))}
                        </Select>
                        <Input
                          label="CVV"
                          value={formData.securityCode}
                          onChange={(e) => handleInputChange('securityCode', e.target.value)}
                          maxLength={4}
                          isRequired
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'financing' && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Información de financiamiento</h4>
                      <Input
                        label="Ingresos mensuales (USD)"
                        value={formData.monthlyIncome}
                        onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                        type="number"
                        isRequired
                      />
                      <Input
                        label="Lugar de trabajo"
                        value={formData.workplace}
                        onChange={(e) => handleInputChange('workplace', e.target.value)}
                        isRequired
                      />
                      <Input
                        label="Tiempo en el trabajo actual"
                        value={formData.jobTime}
                        onChange={(e) => handleInputChange('jobTime', e.target.value)}
                        placeholder="Ej: 2 años y 6 meses"
                        isRequired
                      />
                      <Select
                        label="Tipo de contrato"
                        value={formData.contractType}
                        onChange={(e) => handleInputChange('contractType', e.target.value)}
                        isRequired
                      >
                        <SelectItem key="indefinido">Indefinido</SelectItem>
                        <SelectItem key="temporal">Temporal</SelectItem>
                        <SelectItem key="por-obra">Por obra o servicio</SelectItem>
                        <SelectItem key="otro">Otro</SelectItem>
                      </Select>

                      <h4 className="font-semibold pt-4">Banco para financiamiento</h4>
                      <Select
                        label="Selecciona tu banco"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                      >
                        {banks.map((bank) => (
                          <SelectItem key={bank.key}>
                            {bank.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {/* Resumen */}
                  <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg border dark:border-neutral-600">
                    <h4 className="font-semibold mb-2">Resumen de compra</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Vehículo:</span>
                        <span>{vehicle.brand} {vehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <span>{selectedColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Precio:</span>
                        <span>{formatPrice(vehicle.price)}</span>
                      </div>
                      {paymentMethod === 'financing' && (
                        <>
                          <div className="flex justify-between">
                            <span>Cuota inicial:</span>
                            <span>{formatPrice(downPayment)}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Cuota mensual:</span>
                            <span>{formatPrice(calculateMonthlyPayment())}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={isProcessingPayment}>
                  Cancelar
                </Button>
                <Button
                  className="bg-[#1341ee] text-white"
                  onPress={processBilling}
                  isLoading={isProcessingPayment}
                  isDisabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Procesando...' : 'Confirmar compra'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de autenticación requerida */}
      <Modal isOpen={isAuthModalOpen} onOpenChange={onAuthModalChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                <h3 className="text-xl font-bold">Iniciar sesión requerido</h3>
                <p className="text-sm text-gray-500 font-normal">
                  Para realizar una compra necesitas tener una cuenta
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Inicia sesión o crea una cuenta para:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1341ee] rounded-full flex-shrink-0"></div>
                      Guardar tus datos de pago de forma segura
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1341ee] rounded-full flex-shrink-0"></div>
                      Ver el historial de tus compras
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1341ee] rounded-full flex-shrink-0"></div>
                      Recibir confirmación por email
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1341ee] rounded-full flex-shrink-0"></div>
                      Hacer seguimiento de tu pedido
                    </li>
                  </ul>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-col gap-2">
                <Button
                  className="w-full bg-[#1341ee] text-white"
                  onPress={handleAuthRedirect}
                >
                  Iniciar sesión / Registrarse
                </Button>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de compra exitosa */}
      <Modal isOpen={isSuccessModalOpen} onOpenChange={onSuccessModalChange} size="md" isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Compra exitosa</h3>
                <p className="text-sm text-gray-500 font-normal">
                  Tu compra se ha procesado correctamente
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="text-center space-y-4">
                  {confirmationData && (
                    <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Código de confirmación:</span>
                        <span className="font-mono text-sm font-bold text-[#1341ee]">
                          {confirmationData.confirmationCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">ID de transacción:</span>
                        <span className="font-mono text-xs text-gray-500">
                          {confirmationData.transactionId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Estado del pago:</span>
                        <span className="text-sm font-semibold text-green-600">
                          {confirmationData.paymentStatus === 'approved' ? 'Aprobado' : confirmationData.paymentStatus}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <p>Recibirás un correo electrónico con los detalles de tu compra.</p>
                    <p>El vehículo será preparado para entrega en las próximas 24-48 horas.</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-col gap-2">
                <Button
                  className="w-full bg-[#1341ee] text-white"
                  onPress={() => {
                    onClose()
                    router.push('/vehiculos')
                  }}
                >
                  Continuar navegando
                </Button>
                <Button
                  variant="light"
                  className="w-full"
                  onPress={() => {
                    onClose()
                    router.push('/perfil?tab=purchases')
                  }}
                >
                  Ver mis compras
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de financiamiento multi-paso */}
      <FinancingModalMultiStep
        isOpen={isFinancingModalOpen}
        onOpenChange={onFinancingModalChange}
        vehicleData={{
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          color: selectedColor,
          imageUrl: selectedColorObj?.image || (vehicle as any).images?.[0] || '/placeholder-car.jpg'
        }}
        onConfirm={processFinancing}
        isProcessing={isProcessingPayment}
        error={purchaseError}
      />
    </div>
  )
}