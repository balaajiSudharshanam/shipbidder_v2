export function useFormatters() {
  function formatCurrency(amount: number): string {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function formatLocation(loc: { lat: number; lng: number; address?: string }): string {
    return loc.address ?? `${loc.lat.toFixed(4)}°, ${loc.lng.toFixed(4)}°`
  }

  return { formatCurrency, formatDate, formatDateTime, formatLocation }
}
