'use client'

import { useState } from 'react'
import QuoteWizardModal from '@/components/QuoteWizardModal'

interface EstimateButtonProps {
  state: string
  stateName: string
  defaultZip?: string
  className?: string
  children?: React.ReactNode
  /**
   * Identifier for which CTA on the page fired this button. Two purposes:
   *   1. Plausible auto-tracks via data-event-name attribute (script.tagged-events.js)
   *   2. Passed to QuoteWizard → lead API → leads.cta_source DB column for permanent attribution
   * Examples: "cost_page_estimate_click_hero", "cost_page_estimate_click_cost_section"
   */
  eventName?: string
}

export default function EstimateButton({
  state,
  stateName,
  defaultZip,
  className = '',
  children,
  eventName,
}: EstimateButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={className}
        data-event-name={eventName}
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
          ctaSource={eventName}
        />
      )}
    </>
  )
}
