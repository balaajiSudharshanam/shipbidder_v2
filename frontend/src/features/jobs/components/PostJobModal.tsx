import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { createJob, uploadJobImages } from '../api/jobsApi'
import { useToast } from '../../../common/context/ToastContext'
import type { ShipmentPayload } from '../types'
import StepIndicator from './StepIndicator'
import RouteStep from './RouteStep'
import ShipmentStep from './ShipmentStep'
import TermsStep from './TermsStep'

interface Props {
  onClose: () => void
  onSuccess?: () => void
}

const STEPS = ['Route', 'Shipment', 'Terms']

export default function PostJobModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState(0)
  const [pickupId, setPickupId] = useState<number | null>(null)
  const [dropoffId, setDropoffId] = useState<number | null>(null)
  const [shipment, setShipment] = useState<Partial<ShipmentPayload>>({})
  const { showError } = useToast()
  const [images, setImages] = useState<File[]>([])
  const [budgetCeiling, setBudgetCeiling] = useState('')
  const [auctionClosesAt, setAuctionClosesAt] = useState('')
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleClose = useCallback(() => {
    if (!submitting) onClose()
  }, [submitting, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleLocationChange(field: 'pickupId' | 'dropoffId', value: number | null) {
    if (field === 'pickupId') setPickupId(value)
    else setDropoffId(value)
  }

  async function handleSubmit() {
    if (!pickupId || !dropoffId || !shipment.weightKg || !shipment.cargoType) return
    setSubmitting(true)
    try {
      const job = await createJob({
        pickupId,
        dropoffId,
        shipment: shipment as ShipmentPayload,
        budgetCeiling: Number(budgetCeiling),
        auctionClosesAt: auctionClosesAt.length === 16 ? `${auctionClosesAt}:00` : auctionClosesAt,
        ...(expectedDeliveryDate ? { expectedDeliveryDate } : {}),
      })
      if (images.length > 0) {
        await uploadJobImages(job.id, images)
      }
      onSuccess?.()
      onClose()
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to post job')
      setSubmitting(false)
    }
  }

  return createPortal(
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28,27,27,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--c-light)',
          borderRadius: 14,
          width: '100%',
          maxWidth: 580,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(28,27,27,0.3)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.5rem',
          borderBottom: '1px solid rgba(28,27,27,0.08)',
          flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: 'var(--c-dark)' }}>
            Post a Job
          </h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              color: 'rgba(28,27,27,0.4)',
              fontSize: '1.1rem',
              lineHeight: 1,
              padding: '0.25rem 0.4rem',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: '1.5rem', flex: 1 }}>
          <StepIndicator steps={STEPS} current={step} />

          {step === 0 && (
            <RouteStep
              pickupId={pickupId}
              dropoffId={dropoffId}
              onChange={handleLocationChange}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <ShipmentStep
              value={shipment}
              onChange={patch => setShipment(prev => ({ ...prev, ...patch }))}
              images={images}
              onImagesChange={setImages}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <TermsStep
              budgetCeiling={budgetCeiling}
              auctionClosesAt={auctionClosesAt}
              expectedDeliveryDate={expectedDeliveryDate}
              onBudgetChange={setBudgetCeiling}
              onAuctionChange={setAuctionClosesAt}
              onDeliveryDateChange={setExpectedDeliveryDate}
              onSubmit={() => void handleSubmit()}
              onBack={() => setStep(1)}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
