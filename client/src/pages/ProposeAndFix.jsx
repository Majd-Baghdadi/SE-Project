import ProposeAndFixForm from '../components/ProposeAndFixForm';
import Swal from 'sweetalert2';

export default function ProposeAndFixPage() {
  const handleSubmit = (data) => {
    // TODO: Send to backend API
    Swal.fire({
      title: 'Submission Received',
      text: 'Thank you for your contribution! (Note: API integration pending)',
      icon: 'info',
      confirmButtonColor: '#1976d2'
    });
    console.log('Submitted Data:', data);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7faff', paddingTop: 40 }}>
      <ProposeAndFixForm onSubmit={handleSubmit} />
    </div>
  );
}
