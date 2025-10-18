"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline'

interface Step {
  id: number
  title: string
  description: string
}

interface FinancingFormStepsProps {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  onSubmit?: () => void
  isLastStep?: boolean
  canGoNext?: boolean
  canGoBack?: boolean
}

export function FinancingFormSteps({
  steps,
  currentStep,
  onStepChange,
  children,
  onSubmit,
  isLastStep = false,
  canGoNext = true,
  canGoBack = true
}: FinancingFormStepsProps) {
  const handleNext = () => {
    if (isLastStep && onSubmit) {
      onSubmit()
    } else if (currentStep < steps.length) {
      onStepChange(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center w-full">
                {/* Circle with number */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                      backgroundColor:
                        currentStep > step.id
                          ? '#10b981'
                          : currentStep === step.id
                          ? '#1341ee'
                          : '#e5e7eb'
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center z-10"
                  >
                    {currentStep > step.id ? (
                      <CheckIcon className="w-5 h-5 text-white" />
                    ) : (
                      <span
                        className={`font-semibold ${
                          currentStep === step.id
                            ? 'text-white'
                            : currentStep > step.id
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                      >
                        {step.id}
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Step title and description */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2 -mt-12">
                  <motion.div
                    initial={false}
                    animate={{
                      width: currentStep > step.id ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-green-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          color="default"
          variant="bordered"
          onPress={handleBack}
          isDisabled={!canGoBack || currentStep === 1}
          startContent={<ChevronLeftIcon className="w-4 h-4" />}
        >
          Anterior
        </Button>

        <Button
          color="primary"
          onPress={handleNext}
          isDisabled={!canGoNext}
          endContent={
            isLastStep ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )
          }
        >
          {isLastStep ? 'Confirmar Compra' : 'Siguiente'}
        </Button>
      </div>
    </div>
  )
}
