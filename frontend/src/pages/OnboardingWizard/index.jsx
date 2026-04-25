import React, { useState, useEffect } from 'react'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'

const OnboardingWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(() => {
    return parseInt(sessionStorage.getItem('onboarding_step') || '1')
  })
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('onboarding_data')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      fullName: '',
      businessEmail: '',
      countryCode: '+91',
      whatsappNumber: '',
      companyName: '',
      employeeCount: '',
      annualRevenue: '',
      industries: [],
      subCategory: '',
      objectives: [],
      otpVerified: false
    }
  })

  useEffect(() => {
    sessionStorage.setItem('onboarding_data', JSON.stringify(formData))
    sessionStorage.setItem('onboarding_step', currentStep.toString())
  }, [formData, currentStep])

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleComplete = () => {
    console.log('All onboarding steps completed!')
    // Clear onboarding data after completion
    sessionStorage.removeItem('onboarding_data')
    sessionStorage.removeItem('onboarding_step')
    if (onComplete) {
      onComplete()
    }
  }

  const steps = ['Business Details', 'Industry', 'Objectives', 'Verification']

  const getStepContent = () => {
    switch(currentStep) {
      case 1:
        return <Step1 data={formData} updateData={updateFormData} onNext={handleNext} />
      case 2:
        return <Step2 data={formData} updateData={updateFormData} onNext={handleNext} onBack={handleBack} />
      case 3:
        return <Step3 data={formData} updateData={updateFormData} onNext={handleNext} onBack={handleBack} />
      case 4:
        return <Step4 data={formData} updateData={updateFormData} onComplete={handleComplete} />
      default:
        return <Step1 data={formData} updateData={updateFormData} onNext={handleNext} />
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = currentStep === stepNumber
            const isCompleted = currentStep > stepNumber
            
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${isActive ? 'bg-blue-600 text-white' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {isCompleted ? '✓' : stepNumber}
                  </div>
                  <span className={`text-xs mt-2 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > stepNumber ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
      
      {/* Content Area - Split Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex min-h-[600px]">
          {/* Left side - Form */}
          <div className="w-1/2 p-8 border-r border-gray-200">
            {getStepContent()}
          </div>
          
          {/* Right side - Illustration */}
          <div className="w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">WhatsApp Business</h3>
              <p className="text-gray-600">Connect with your customers seamlessly</p>
              <div className="mt-6 text-sm text-gray-500">
                <p className="mb-2">✓ Reach customers instantly</p>
                <p className="mb-2">✓ Automate responses</p>
                <p>✓ Track engagement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWizard