'use client'

interface BusinessCardActionsProps {
  businessUrl: string
  phone?: string
  websiteUrl?: string
  estimateUrl?: string
}

export default function BusinessCardActions({ businessUrl, phone, websiteUrl }: BusinessCardActionsProps) {
  return (
    <div className="mt-auto flex flex-col sm:flex-row gap-3" onClick={(e) => e.stopPropagation()}>
      <a
        href={businessUrl}
        className="flex-1 text-center rounded-lg bg-amber-500 py-3 px-6 text-base font-bold text-white transition-colors hover:bg-amber-600"
      >
        View Profile
      </a>
      {phone && (
        <a 
          href={`tel:${phone}`}
          className="flex-1 text-center border border-blue-500 text-blue-600 px-6 py-3 rounded-lg text-base font-bold hover:bg-blue-50 transition-colors"
        >
          {phone}
        </a>
      )}
      {websiteUrl && (
        <a 
          href={websiteUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors"
          title="Visit website"
        >
          <span className="material-symbols-outlined">open_in_new</span>
        </a>
      )}
      <a
        href={businessUrl}
        className="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <span className="material-symbols-outlined">info</span>
      </a>
    </div>
  )
}
