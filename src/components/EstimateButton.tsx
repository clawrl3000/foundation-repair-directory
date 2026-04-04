'use client'

import { useState } from 'react'
import QuoteWizardModal from '@/components/QuoteWizardModal'

interface EstimateButtonProps {
  state: string
  stateName: string
  defaultZip?: string
  className?: string
  children?: React.ReactNode
}

export default function EstimateButton({
  state,
  stateName,
  defaultZip,
  className = '',
  children,
}: EstimateButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={className}
      >
        {children || (
          <>
            <span className="material-symbols-outlined text-lg">request_quote</span>
            Get Estimate
          </>
        )}
      </button>
      {showModal && (
        <QuoteWizardModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          state={state}
          stateName={stateName}
          defaultZip={defaultZip}
        />
      )}
    </>
  )
}
