"use client"

import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react'
import { FinancingFormSteps } from './financing-form-steps'
import { FinancingStep1Payment } from './financing-step-1-payment'
import { FinancingStep2Application } from './financing-step-2-application'
import { FinancingStep3Confirmation } from './financing-step-3-confirmation'

interface FinancingModalMultiStepProps {
  isOpen: boolean
  onOpenChange: () => void
  vehicleData: {
    brand: string
    model: string
    year: number
    price: number
    color: string
    imageUrl?: string
  }
  onConfirm: (formData: any) => void
  isProcessing: boolean
  error: string | null
}

export function FinancingModalMultiStep({
  isOpen,
  onOpenChange,
  vehicleData,
  onConfirm,
  isProcessing,
  error
}: FinancingModalMultiStepProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Paso 1: Datos principales
    downPayment: (vehicleData.price * 0.2).toString(),
    loanTerms: '36',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',

    // Paso 2: Información laboral y financiera
    employmentStatus: '',
    employerName: '',
    occupation: '',
    timeInCurrentJob: '',
    monthlyIncome: '',
    additionalIncome: '0',
    additionalIncomeSource: '',
    housingType: '',
    monthlyHousingCost: '0',
    hasActiveDebts: false,
    totalMonthlyDebts: '0',
    bankName: '',
    accountType: 'ninguna',
    timeAsCustomer: '',
    personalReferences: [] as Array<{ name: string; phone: string; relationship: string }>,
    identificationNumber: '',
    maritalStatus: '',
    numberOfDependents: '0',
    hasCurrentVehicle: false,
    currentVehicleDetails: '',
    hasPreviousVehicleFinancing: false,
    vehiclePurpose: '',
    authorizeCreditCheck: false,
    authorizeInformationVerification: false,
    acceptTermsAndConditions: false,
  })

  const steps = [
    {
      id: 1,
      title: 'Datos de Pago',
      description: 'Información personal y financiamiento'
    },
    {
      id: 2,
      title: 'Solicitud',
      description: 'Información laboral y financiera'
    },
    {
      id: 3,
      title: 'Confirmación',
      description: 'Revisa y confirma tu solicitud'
    }
  ]

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep1 = () => {
    if (!formData.downPayment || parseFloat(formData.downPayment) < vehicleData.price * 0.2) {
      return false
    }
    if (!formData.loanTerms) return false
    if (!formData.firstName.trim()) return false
    if (!formData.lastName.trim()) return false
    if (!formData.email.trim()) return false
    if (!formData.phone.trim()) return false
    if (!formData.address.trim()) return false
    if (!formData.city) return false
    if (!formData.postalCode.trim()) return false
    return true
  }

  const validateStep2 = () => {
    if (!formData.employmentStatus) return false
    if (!formData.occupation.trim()) return false
    if (!formData.monthlyIncome.trim() || parseFloat(formData.monthlyIncome) <= 0) return false
    if (!formData.housingType) return false
    if (!formData.identificationNumber.trim() || formData.identificationNumber.length !== 10) return false
    if (!formData.maritalStatus) return false
    if (!formData.vehiclePurpose) return false
    if (!formData.authorizeCreditCheck) return false
    if (!formData.authorizeInformationVerification) return false
    if (!formData.acceptTermsAndConditions) return false

    // Validar referencias (al menos 2)
    if (!formData.personalReferences || formData.personalReferences.length < 2) return false
    for (const ref of formData.personalReferences) {
      if (!ref.name.trim() || !ref.phone.trim() || !ref.relationship.trim()) return false
    }

    return true
  }

  const canGoNext = () => {
    if (currentStep === 1) return validateStep1()
    if (currentStep === 2) return validateStep2()
    return true
  }

  const handleSubmit = () => {
    onConfirm(formData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FinancingStep1Payment
            formData={formData}
            onChange={handleFieldChange}
            vehiclePrice={vehicleData.price}
          />
        )
      case 2:
        return (
          <FinancingStep2Application
            formData={formData}
            onChange={handleFieldChange}
          />
        )
      case 3:
        return (
          <FinancingStep3Confirmation
            formData={formData}
            vehicleData={vehicleData}
          />
        )
      default:
        return null
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
      isDismissable={false}
      classNames={{
        base: "max-h-[95vh]",
        body: "overflow-y-auto px-6 py-4"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Solicitud de Financiamiento
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                {vehicleData.brand} {vehicleData.model} {vehicleData.year} - {vehicleData.color}
              </p>
            </ModalHeader>

            <ModalBody className="py-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
                  </div>
                </div>
              )}

              <FinancingFormSteps
                steps={steps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onSubmit={handleSubmit}
                isLastStep={currentStep === 3}
                canGoNext={canGoNext()}
                canGoBack={currentStep > 1}
              >
                {renderStepContent()}
              </FinancingFormSteps>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
