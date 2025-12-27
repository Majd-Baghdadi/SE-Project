import { useNavigate } from 'react-router-dom';

export default function ReportIssueButton({ docSlug }) {
  const navigate = useNavigate();
  function onReport() {
    // Navigate to the propose-fix page, optionally with docSlug as state
    navigate('/propose-fix', { state: docSlug ? { docSlug } : undefined });
  }

  return (
    <button onClick={onReport} style={{ background: '#ffefef', borderColor: '#ff6b6b' }}>Report an issue</button>
  );
}
