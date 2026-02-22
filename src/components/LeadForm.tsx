'use client'

import { useState } from 'react'

interface LeadFormProps {
  isOpen: boolean
  onClose: () => void
  businessId?: string
  businessName?: string
}

const SERVICE_TYPES = [
  { value: 'foundation-repair', label: 'Foundation Repair' },
  { value: 'piering', label: 'Piering / Underpinning' },
  { value: 'slab-repair', label: 'Slab Repair' },
  { value: 'basement-waterproofing', label: 'Basement Waterproofing' },
  { value: 'crawl-space', label: 'Crawl Space Repair' },
  { value: 'drainage', label: 'Drainage Solutions' },
  { value: 'other', label: 'Other Foundation Issue' },
]

const URGENCY_LEVELS = [
  { value: 'low', label: 'Not urgent - planning ahead' },
  { value: 'medium', label: 'Within a few weeks' },
  { value: 'high', label: 'As soon as possible' },
  { value: 'emergency', label: 'Emergency - immediate help needed' },
]

export default function LeadForm({ isOpen, onClose, businessId, businessName }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    service_needed: '',
    urgency: 'medium',
    message: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          business_id: businessId,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          zip: '',
          service_needed: '',
          urgency: 'medium',
          message: '',
        })
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error - please try again')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white border border-slate-200 rounded-lg shadow-xl">
        {success ? (
          // Success state
          <div className="p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-green-400 mb-4" role="img" aria-label="Request submitted successfully">check_circle</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Request Submitted!</h3>
            <p className="text-slate-600 mb-6">
              We'll connect you with {businessName ? businessName : 'qualified contractors'} in your area shortly.
            </p>
            <button
              onClick={handleClose}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          // Form state
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Get Estimates</h3>
                {businessName && (
                  <p className="text-sm text-slate-600">Get quotes from {businessName}</p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <span className="material-symbols-outlined text-xl" role="img" aria-label="Close form">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <div className="flex">
                    <span className="material-symbols-outlined text-xl text-red-400 mr-2" aria-hidden="true">error</span>
                    <div className="text-sm text-red-300">{error}</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md placeholder-slate-400 text-slate-900 bg-white focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-slate-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    id="zip"
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md placeholder-slate-400 text-slate-900 bg-white focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    placeholder="12345"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md placeholder-slate-400 text-slate-900 bg-white focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md placeholder-slate-400 text-slate-900 bg-white focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="service_needed" className="block text-sm font-medium text-slate-700 mb-1">
                  Service Needed *
                </label>
                <select
                  id="service_needed"
                  required
                  value={formData.service_needed}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_needed: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="">Select a service</option>
                  {SERVICE_TYPES.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-slate-700 mb-1">
                  Urgency
                </label>
                <select
                  id="urgency"
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  {URGENCY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md placeholder-slate-400 text-slate-900 bg-white focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="Describe the foundation issue you're experiencing..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Get Estimates'}
              </button>

              <p className="text-xs text-slate-500 text-center">
                By submitting, you agree to be contacted by foundation repair contractors in your area.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}