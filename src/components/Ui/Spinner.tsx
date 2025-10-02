const Spinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-70 z-50">
    <div className="w-16 h-16 rounded-full animate-spin relative">
      <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-pink-500 animate-spin-slow" />
      <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-green-400 animate-spin-reverse" />
    </div>
  </div>
);
export default Spinner;
