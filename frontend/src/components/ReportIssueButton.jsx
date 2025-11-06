export default function ReportIssueButton({ docSlug }) {
  function onReport() {
    // This would open a modal or navigate to a report form. For now we just log.
    // In a full app you'd open a modal and POST to an API.
    alert(`Report an issue for: ${docSlug}`)
  }

  return (
    <button onClick={onReport} style={{ background: '#ffefef', borderColor: '#ff6b6b' }}>Report an issue</button>
  )
}
