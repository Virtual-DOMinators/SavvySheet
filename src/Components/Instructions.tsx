const Instructions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg text-black font-semibold mb-4">Instruktioner</h2>
      <ol className="list-decimal text-black list-inside space-y-2">
        <li>Välj en Excel-fil (.xlsx)</li>
        <li>Redigera data i tabellen</li>
        <li>Klicka "Exportera PDF"</li>
      </ol>
    </div>
  );
};

export default Instructions;
