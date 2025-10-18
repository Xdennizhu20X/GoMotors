"use client"

import { Input, Select, SelectItem } from '@heroui/react'
import { CreditCardIcon, CalculatorIcon } from '@heroicons/react/24/outline'

interface FinancingStep1Props {
  formData: {
    downPayment: string
    loanTerms: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  onChange: (field: string, value: string) => void
  vehiclePrice: number
}

export function FinancingStep1Payment({ formData, onChange, vehiclePrice }: FinancingStep1Props) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateMonthlyPayment = () => {
    const downPayment = parseFloat(formData.downPayment) || 0
    const loanAmount = vehiclePrice - downPayment
    const terms = parseInt(formData.loanTerms) || 12
    const interestRate = 0.085 // 8.5% anual
    const monthlyRate = interestRate / 12

    if (loanAmount <= 0 || terms <= 0) return 0

    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, terms)) /
      (Math.pow(1 + monthlyRate, terms) - 1)

    return monthlyPayment
  }

  const loanTermOptions = [
    { value: '12', label: '12 meses (1 año)' },
    { value: '24', label: '24 meses (2 años)' },
    { value: '36', label: '36 meses (3 años)' },
    { value: '48', label: '48 meses (4 años)' },
    { value: '60', label: '60 meses (5 años)' },
  ]

  const cities = [
    'Quito',
    'Guayaquil',
    'Cuenca',
    'Loja',
    'Ambato',
    'Riobamba',
    'Manta',
    'Portoviejo',
    'Machala',
    'Esmeraldas'
  ]

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CalculatorIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            Resumen del Financiamiento
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Precio del vehículo</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(vehiclePrice)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Enganche</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(parseFloat(formData.downPayment) || 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Monto a financiar</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(vehiclePrice - (parseFloat(formData.downPayment) || 0))}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Pago mensual estimado</p>
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              {formatPrice(calculateMonthlyPayment())}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCardIcon className="w-5 h-5" />
          Detalles del Financiamiento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Enganche / Entrada"
            placeholder="5000"
            type="number"
            value={formData.downPayment}
            onChange={(e) => onChange('downPayment', e.target.value)}
            startContent={<span className="text-gray-500">$</span>}
            description={`Mínimo 20%: ${formatPrice(vehiclePrice * 0.2)}`}
            isRequired
          />

          <Select
            label="Plazo del préstamo"
            placeholder="Selecciona el plazo"
            selectedKeys={formData.loanTerms ? [formData.loanTerms] : []}
            onChange={(e) => onChange('loanTerms', e.target.value)}
            isRequired
          >
            {loanTermOptions.map((option) => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Información Personal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombres"
            placeholder="Juan Carlos"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            isRequired
          />

          <Input
            label="Apellidos"
            placeholder="González Pérez"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            isRequired
          />

          <Input
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            isRequired
          />

          <Input
            label="Teléfono"
            placeholder="0999999999"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            isRequired
          />

          <Input
            label="Dirección"
            placeholder="Av. Principal 123"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            isRequired
            className="md:col-span-2"
          />

          <Select
            label="Ciudad"
            placeholder="Selecciona tu ciudad"
            selectedKeys={formData.city ? [formData.city] : []}
            onChange={(e) => onChange('city', e.target.value)}
            isRequired
          >
            {cities.map((city) => (
              <SelectItem key={city}>
                {city}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Código Postal"
            placeholder="170123"
            value={formData.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            isRequired
          />
        </div>
      </div>
    </div>
  )
}
