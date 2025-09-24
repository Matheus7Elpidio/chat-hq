const AgentSettings = () => {
  // A correção está aqui: o parêntese de abertura após o return estava faltando.
  // Isso causava um retorno de `undefined` e quebrava a renderização.
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Configurações do Agente</h1>
      <p className="mt-2 text-muted-foreground">
        Ajuste suas preferências e configurações da conta.
      </p>
      {/* Opções de configuração do agente virão aqui */}
    </div>
  );
};

export default AgentSettings;
