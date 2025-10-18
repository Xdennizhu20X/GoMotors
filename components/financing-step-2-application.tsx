"use client"

import { Input, Select, SelectItem, Checkbox, Button } from '@heroui/react'
import { BriefcaseIcon, HomeIcon, CurrencyDollarIcon, UserGroupIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface PersonalReference {
  name: string
  phone: string
  relationship: string
}

interface FinancingStep2Props {
  formData: {
    // Información Laboral
    employmentStatus: string
    employerName: string
    occupation: string
    timeInCurrentJob: string

    // Ingresos
    monthlyIncome: string
    additionalIncome: string
    additionalIncomeSource: string

    // Vivienda
    housingType: string
    monthlyHousingCost: string

    // Financiera
    hasActiveDebts: boolean
    totalMonthlyDebts: string

    // Bancaria
    bankName: string
    accountType: string
    timeAsCustomer: string

    // Personal
    identificationNumber: string
    maritalStatus: string
    numberOfDependents: string

    // Vehículo
    hasCurrentVehicle: boolean
    currentVehicleDetails: string
    hasPreviousVehicleFinancing: boolean
    vehiclePurpose: string

    // Referencias
    personalReferences: PersonalReference[]

    // Autorizaciones
    authorizeCreditCheck: boolean
    authorizeInformationVerification: boolean
    acceptTermsAndConditions: boolean
  }
  onChange: (field: string, value: any) => void
}

export function FinancingStep2Application({ formData, onChange }: FinancingStep2Props) {
  const employmentStatusOptions = [
    { value: 'empleado_tiempo_completo', label: 'Empleado Tiempo Completo' },
    { value: 'empleado_tiempo_parcial', label: 'Empleado Tiempo Parcial' },
    { value: 'independiente', label: 'Independiente/Autónomo' },
    { value: 'empresario', label: 'Empresario' },
    { value: 'jubilado', label: 'Jubilado' },
    { value: 'desempleado', label: 'Desempleado' },
  ]

  const housingTypeOptions = [
    { value: 'propia_pagada', label: 'Propia (Pagada)' },
    { value: 'propia_hipoteca', label: 'Propia (Con Hipoteca)' },
    { value: 'alquilada', label: 'Alquilada' },
    { value: 'familiar', label: 'Familiar' },
  ]

  const maritalStatusOptions = [
    { value: 'soltero', label: 'Soltero/a' },
    { value: 'casado', label: 'Casado/a' },
    { value: 'divorciado', label: 'Divorciado/a' },
    { value: 'viudo', label: 'Viudo/a' },
    { value: 'union_libre', label: 'Unión Libre' },
  ]

  const accountTypeOptions = [
    { value: 'ahorros', label: 'Ahorros' },
    { value: 'corriente', label: 'Corriente' },
    { value: 'ninguna', label: 'No tengo cuenta' },
  ]

  const vehiclePurposeOptions = [
    { value: 'trabajo', label: 'Trabajo' },
    { value: 'personal', label: 'Personal' },
    { value: 'familia', label: 'Familia' },
    { value: 'negocio', label: 'Negocio' },
  ]

  const banksInEcuador = [
    'Banco Pichincha',
    'Banco del Pacífico',
    'Banco Guayaquil',
    'Produbanco',
    'Banco Internacional',
    'Banco Bolivariano',
    'Banco del Austro',
    'Banco General Rumiñahui',
    'Banco Solidario',
    'Otro'
  ]

  const addReference = () => {
    const newReferences = [...(formData.personalReferences || []), { name: '', phone: '', relationship: '' }]
    onChange('personalReferences', newReferences)
  }

  const removeReference = (index: number) => {
    const newReferences = formData.personalReferences.filter((_, i) => i !== index)
    onChange('personalReferences', newReferences)
  }

  const updateReference = (index: number, field: string, value: string) => {
    const newReferences = [...formData.personalReferences]
    newReferences[index] = { ...newReferences[index], [field]: value }
    onChange('personalReferences', newReferences)
  }

  return (
    <div className="space-y-8">
      {/* Información Laboral */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BriefcaseIcon className="w-5 h-5 text-blue-600" />
          Información Laboral
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Situación Laboral"
            placeholder="Selecciona tu situación"
            selectedKeys={formData.employmentStatus ? [formData.employmentStatus] : []}
            onChange={(e) => onChange('employmentStatus', e.target.value)}
            isRequired
          >
            {employmentStatusOptions.map((option) => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>

          {['empleado_tiempo_completo', 'empleado_tiempo_parcial'].includes(formData.employmentStatus) && (
            <Input
              label="Nombre de la Empresa"
              placeholder="Empresa ABC S.A."
              value={formData.employerName}
              onChange={(e) => onChange('employerName', e.target.value)}
              isRequired
            />
          )}

          <Input
            label="Cargo / Ocupación"
            placeholder="Gerente, Técnico, etc."
            value={formData.occupation}
            onChange={(e) => onChange('occupation', e.target.value)}
            isRequired
          />

          {formData.employmentStatus !== 'desempleado' && (
            <Input
              label="Tiempo en el Empleo Actual"
              placeholder="24"
              type="number"
              value={formData.timeInCurrentJob}
              onChange={(e) => onChange('timeInCurrentJob', e.target.value)}
              endContent={<span className="text-gray-500">meses</span>}
              isRequired
            />
          )}
        </div>
      </div>

      {/* Información de Ingresos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
          Información de Ingresos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ingresos Mensuales Netos"
            placeholder="1500"
            type="number"
            value={formData.monthlyIncome}
            onChange={(e) => onChange('monthlyIncome', e.target.value)}
            startContent={<span className="text-gray-500">$</span>}
            isRequired
          />

          <Input
            label="Ingresos Adicionales (Opcional)"
            placeholder="500"
            type="number"
            value={formData.additionalIncome}
            onChange={(e) => onChange('additionalIncome', e.target.value)}
            startContent={<span className="text-gray-500">$</span>}
          />

          {parseFloat(formData.additionalIncome) > 0 && (
            <Input
              label="Fuente de Ingresos Adicionales"
              placeholder="Rentas, negocio secundario, etc."
              value={formData.additionalIncomeSource}
              onChange={(e) => onChange('additionalIncomeSource', e.target.value)}
              className="md:col-span-2"
            />
          )}
        </div>
      </div>

      {/* Información de Vivienda */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <HomeIcon className="w-5 h-5 text-purple-600" />
          Información de Vivienda
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Vivienda"
            placeholder="Selecciona el tipo"
            selectedKeys={formData.housingType ? [formData.housingType] : []}
            onChange={(e) => onChange('housingType', e.target.value)}
            isRequired
          >
            {housingTypeOptions.map((option) => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>

          {['propia_hipoteca', 'alquilada'].includes(formData.housingType) && (
            <Input
              label="Gasto Mensual de Vivienda"
              placeholder="300"
              type="number"
              value={formData.monthlyHousingCost}
              onChange={(e) => onChange('monthlyHousingCost', e.target.value)}
              startContent={<span className="text-gray-500">$</span>}
              isRequired
            />
          )}
        </div>
      </div>

      {/* Información Financiera */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Información Financiera
        </h3>

        <div className="space-y-4">
          <Checkbox
            isSelected={formData.hasActiveDebts}
            onValueChange={(checked) => onChange('hasActiveDebts', checked)}
          >
            ¿Tiene deudas activas? (Tarjetas de crédito, préstamos, etc.)
          </Checkbox>

          {formData.hasActiveDebts && (
            <Input
              label="Total de Deudas Mensuales"
              placeholder="200"
              type="number"
              value={formData.totalMonthlyDebts}
              onChange={(e) => onChange('totalMonthlyDebts', e.target.value)}
              startContent={<span className="text-gray-500">$</span>}
              description="Suma de todos los pagos mensuales de deudas"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Select
            label="Banco Principal"
            placeholder="Selecciona tu banco"
            selectedKeys={formData.bankName ? [formData.bankName] : []}
            onChange={(e) => onChange('bankName', e.target.value)}
          >
            {banksInEcuador.map((bank) => (
              <SelectItem key={bank}>
                {bank}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Tipo de Cuenta"
            placeholder="Selecciona el tipo"
            selectedKeys={formData.accountType ? [formData.accountType] : []}
            onChange={(e) => onChange('accountType', e.target.value)}
          >
            {accountTypeOptions.map((option) => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>

          {formData.accountType !== 'ninguna' && (
            <Input
              label="Tiempo como Cliente"
              placeholder="3"
              type="number"
              value={formData.timeAsCustomer}
              onChange={(e) => onChange('timeAsCustomer', e.target.value)}
              endContent={<span className="text-gray-500">años</span>}
            />
          )}
        </div>
      </div>

      {/* Información Personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5 text-orange-600" />
          Información Personal Adicional
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Número de Cédula"
            placeholder="1234567890"
            value={formData.identificationNumber}
            onChange={(e) => onChange('identificationNumber', e.target.value)}
            maxLength={10}
            isRequired
          />

          <Select
            label="Estado Civil"
            placeholder="Selecciona"
            selectedKeys={formData.maritalStatus ? [formData.maritalStatus] : []}
            onChange={(e) => onChange('maritalStatus', e.target.value)}
            isRequired
          >
            {maritalStatusOptions.map((option) => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Número de Dependientes"
            placeholder="0"
            type="number"
            value={formData.numberOfDependents}
            onChange={(e) => onChange('numberOfDependents', e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Información sobre Vehículo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Información sobre Vehículo
        </h3>

        <div className="space-y-4">
          <Checkbox
            isSelected={formData.hasCurrentVehicle}
            onValueChange={(checked) => onChange('hasCurrentVehicle', checked)}
          >
            ¿Tiene vehículo actualmente?
          </Checkbox>

          {formData.hasCurrentVehicle && (
            <Input
              label="Detalles del Vehículo Actual"
              placeholder="Toyota Corolla 2015"
              value={formData.currentVehicleDetails}
              onChange={(e) => onChange('currentVehicleDetails', e.target.value)}
            />
          )}

          <Checkbox
            isSelected={formData.hasPreviousVehicleFinancing}
            onValueChange={(checked) => onChange('hasPreviousVehicleFinancing', checked)}
          >
            ¿Ha tenido financiamiento vehicular anteriormente?
          </Checkbox>

          <Select
            label="¿Por qué necesita el vehículo?"
            placeholder="Selecciona el propósito"
            selectedKeys={formData.vehiclePurpose ? [formData.vehiclePurpose] : []}
            onChange={(e) => onChange('vehiclePurpose', e.target.value)}
            isRequired
          >
            {vehiclePurposeOptions.map((option) => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Referencias Personales */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Referencias Personales
          </h3>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={addReference}
            startContent={<PlusIcon className="w-4 h-4" />}
            isDisabled={(formData.personalReferences?.length || 0) >= 3}
          >
            Agregar Referencia
          </Button>
        </div>

        {formData.personalReferences?.map((reference, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Referencia {index + 1}
              </h4>
              <Button
                size="sm"
                color="danger"
                variant="light"
                isIconOnly
                onPress={() => removeReference(index)}
              >
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Nombre Completo"
                placeholder="María López"
                value={reference.name}
                onChange={(e) => updateReference(index, 'name', e.target.value)}
                isRequired
              />

              <Input
                label="Teléfono"
                placeholder="0999999999"
                type="tel"
                value={reference.phone}
                onChange={(e) => updateReference(index, 'phone', e.target.value)}
                isRequired
              />

              <Input
                label="Relación"
                placeholder="Amigo, Familiar, Colega"
                value={reference.relationship}
                onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                isRequired
              />
            </div>
          </div>
        ))}

        {(!formData.personalReferences || formData.personalReferences.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No has agregado referencias personales
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Se recomienda agregar al menos 2 referencias
            </p>
          </div>
        )}
      </div>

      {/* Autorizaciones */}
      <div className="space-y-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Autorizaciones Requeridas
        </h3>

        <div className="space-y-3">
          <Checkbox
            isSelected={formData.authorizeCreditCheck}
            onValueChange={(checked) => onChange('authorizeCreditCheck', checked)}
            isRequired
          >
            <span className="text-sm">
              Autorizo la verificación de mi historial crediticio en burós de crédito
            </span>
          </Checkbox>

          <Checkbox
            isSelected={formData.authorizeInformationVerification}
            onValueChange={(checked) => onChange('authorizeInformationVerification', checked)}
            isRequired
          >
            <span className="text-sm">
              Acepto que la información proporcionada será verificada con empleadores y referencias
            </span>
          </Checkbox>

          <Checkbox
            isSelected={formData.acceptTermsAndConditions}
            onValueChange={(checked) => onChange('acceptTermsAndConditions', checked)}
            isRequired
          >
            <span className="text-sm">
              Acepto los términos y condiciones del financiamiento y declaro que la información es verídica
            </span>
          </Checkbox>
        </div>
      </div>
    </div>
  )
}
