"use client"

import { Card, CardBody, Divider, Chip } from '@heroui/react'
import { CheckCircleIcon, UserIcon, BriefcaseIcon, HomeIcon, CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface FinancingStep3Props {
  formData: any
  vehicleData: {
    brand: string
    model: string
    year: number
    price: number
    color: string
    imageUrl?: string
  }
}

export function FinancingStep3Confirmation({ formData, vehicleData }: FinancingStep3Props) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateTotalPayment = () => {
    const downPayment = parseFloat(formData.downPayment) || 0
    const loanAmount = vehicleData.price - downPayment
    const terms = parseInt(formData.loanTerms) || 12
    const interestRate = 0.085 // 8.5% anual
    const monthlyRate = interestRate / 12

    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, terms)) /
      (Math.pow(1 + monthlyRate, terms) - 1)

    const totalPayment = monthlyPayment * terms + downPayment
    return {
      monthlyPayment,
      totalPayment,
      totalInterest: totalPayment - vehicleData.price
    }
  }

  const payment = calculateTotalPayment()

  const getEmploymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      empleado_tiempo_completo: 'Empleado Tiempo Completo',
      empleado_tiempo_parcial: 'Empleado Tiempo Parcial',
      independiente: 'Independiente/Autónomo',
      empresario: 'Empresario',
      jubilado: 'Jubilado',
      desempleado: 'Desempleado'
    }
    return labels[status] || status
  }

  const getHousingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      propia_pagada: 'Propia (Pagada)',
      propia_hipoteca: 'Propia (Con Hipoteca)',
      alquilada: 'Alquilada',
      familiar: 'Familiar'
    }
    return labels[type] || type
  }

  const getMaritalStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      soltero: 'Soltero/a',
      casado: 'Casado/a',
      divorciado: 'Divorciado/a',
      viudo: 'Viudo/a',
      union_libre: 'Unión Libre'
    }
    return labels[status] || status
  }

  const getVehiclePurposeLabel = (purpose: string) => {
    const labels: Record<string, string> = {
      trabajo: 'Trabajo',
      personal: 'Personal',
      familia: 'Familia',
      negocio: 'Negocio'
    }
    return labels[purpose] || purpose
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Revisa tu Solicitud
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Por favor verifica que toda la información sea correcta antes de confirmar
        </p>
      </div>

      {/* Información del Vehículo */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vehículo Seleccionado
          </h3>
          <div className="flex gap-4">
            {vehicleData.imageUrl && (
              <img
                src={vehicleData.imageUrl}
                alt={`${vehicleData.brand} ${vehicleData.model}`}
                className="w-32 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {vehicleData.brand} {vehicleData.model} {vehicleData.year}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Color: {vehicleData.color}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {formatPrice(vehicleData.price)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Detalles del Financiamiento */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            Detalles del Financiamiento
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Precio del vehículo</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(vehicleData.price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enganche</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(parseFloat(formData.downPayment) || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monto a financiar</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(vehicleData.price - (parseFloat(formData.downPayment) || 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plazo</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formData.loanTerms} meses
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de interés</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">8.5% anual</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pago mensual</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {formatPrice(payment.monthlyPayment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de intereses</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(payment.totalInterest)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total a pagar</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(payment.totalPayment)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Información Personal */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Nombre completo</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Cédula</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formData.identificationNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Teléfono</p>
              <p className="font-medium text-gray-900 dark:text-white">{formData.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Estado Civil</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {getMaritalStatusLabel(formData.maritalStatus)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Dependientes</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formData.numberOfDependents || 0}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600 dark:text-gray-400">Dirección</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formData.address}, {formData.city} - {formData.postalCode}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Información Laboral y Financiera */}
      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-purple-600" />
              Información Laboral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Situación laboral</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getEmploymentStatusLabel(formData.employmentStatus)}
                </p>
              </div>
              {formData.employerName && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Empresa</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.employerName}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-600 dark:text-gray-400">Ocupación</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.occupation}</p>
              </div>
              {formData.timeInCurrentJob && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tiempo en empleo</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.timeInCurrentJob} meses
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-600 dark:text-gray-400">Ingresos mensuales</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {formatPrice(parseFloat(formData.monthlyIncome) || 0)}
                </p>
              </div>
              {parseFloat(formData.additionalIncome) > 0 && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Ingresos adicionales</p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {formatPrice(parseFloat(formData.additionalIncome))}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Divider />

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HomeIcon className="w-5 h-5 text-orange-600" />
              Información de Vivienda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Tipo de vivienda</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getHousingTypeLabel(formData.housingType)}
                </p>
              </div>
              {['propia_hipoteca', 'alquilada'].includes(formData.housingType) && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Gasto mensual</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(parseFloat(formData.monthlyHousingCost) || 0)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Referencias */}
      {formData.personalReferences && formData.personalReferences.length > 0 && (
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
              Referencias Personales
            </h3>
            <div className="space-y-3">
              {formData.personalReferences.map((ref: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{ref.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{ref.relationship}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{ref.phone}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Información Adicional */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Información Adicional
          </h3>
          <div className="flex flex-wrap gap-2">
            <Chip color="primary" variant="flat">
              Propósito: {getVehiclePurposeLabel(formData.vehiclePurpose)}
            </Chip>
            {formData.hasCurrentVehicle && (
              <Chip color="secondary" variant="flat">
                Tiene vehículo actual
              </Chip>
            )}
            {formData.hasPreviousVehicleFinancing && (
              <Chip color="success" variant="flat">
                Financiamiento vehicular previo
              </Chip>
            )}
            {formData.hasActiveDebts && (
              <Chip color="warning" variant="flat">
                Deudas activas: {formatPrice(parseFloat(formData.totalMonthlyDebts) || 0)}/mes
              </Chip>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Autorizaciones */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Autorizaciones Confirmadas
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <CheckCircleIcon className="w-4 h-4" />
            <span>Verificación de historial crediticio autorizada</span>
          </div>
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <CheckCircleIcon className="w-4 h-4" />
            <span>Verificación de información autorizada</span>
          </div>
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <CheckCircleIcon className="w-4 h-4" />
            <span>Términos y condiciones aceptados</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Importante:</strong> Al confirmar, tu solicitud será enviada para revisión.
          Nos pondremos en contacto contigo en las próximas 24-48 horas para continuar con el proceso.
        </p>
      </div>
    </div>
  )
}
