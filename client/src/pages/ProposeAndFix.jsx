import ProposeAndFixForm from '../components/ProposeAndFixForm';

export default function ProposeAndFixPage() {
  const handleSubmit = (data) => {
    // TODO: Send to backend API
    alert(`Submitted: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7faff', paddingTop: 40 }}>
      <ProposeAndFixForm onSubmit={handleSubmit} />
    </div>
  );
}
