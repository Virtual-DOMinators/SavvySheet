const Spinner: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80px',
    }}
  >
    <span className="loading loading-spinner loading-lg" aria-label="Laddar..." />
  </div>
);

export default Spinner;
