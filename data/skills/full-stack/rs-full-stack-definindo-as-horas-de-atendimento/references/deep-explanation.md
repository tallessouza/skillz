# Deep Explanation: Centralizar Constantes de Negocio

## Por que separar em arquivos dedicados?

O instrutor enfatiza um principio de organizacao: **cada arquivo deve ter um proposito claro e obvio pelo nome**. Quando voce cria `utils/opening-hours.js`, qualquer desenvolvedor que abra a estrutura de pastas entende imediatamente onde estao os horarios de funcionamento.

### A analogia da manutencao

O instrutor destaca: "Se voce quiser mudar o horario de funcionamento, voce vem aqui e tira." Esse e o teste definitivo de boa organizacao — **quao facil e fazer uma mudanca de negocio?**

Se os horarios estao espalhados em 3 componentes, mudar o horario de abertura exige encontrar e atualizar 3 lugares. Se estao centralizados, e uma unica edicao.

### Estrutura progressiva de pastas

O instrutor nota que a estrutura de pastas vai crescendo organicamente:

```
src/
├── components/    # UI
├── utils/         # Configuracao e helpers
├── services/      # Chamadas API
└── ...
```

Cada pasta tem um **proposito semantico**. `utils/` nao e lixeira — e onde ficam valores de configuracao e funcoes auxiliares que nao sao componentes nem servicos.

### Por que array e nao objeto?

O instrutor escolhe um array simples `["09:00", "10:00", ...]` porque:

1. **Iteracao direta** — `.map()` para renderizar, `.filter()` para disponibilidade
2. **Ordem importa** — horarios tem ordem natural
3. **Simplicidade** — nao ha metadados extras necessarios neste momento

Se no futuro cada horario precisar de metadados (preco diferente, capacidade), ai sim migrar para array de objetos. Mas comecar simples e correto.

### Formato string vs numero

O instrutor usa formato `"09:00"` (string) em vez de `9` (numero). Strings no formato HH:MM sao:
- Renderizaveis diretamente na UI sem formatacao
- Comparaveis como strings (ordem lexicografica funciona para horarios)
- Compativeis com APIs que esperam formato ISO de tempo

### Conexao com a API

O instrutor menciona que esse arquivo sera usado na integracao com a API de agendamento. Os horarios servem como **opcoes validas** que o usuario pode selecionar. A API recebe o horario escolhido e cria o agendamento.

Centralizar os horarios garante que frontend e validacao usem a mesma fonte de verdade.

## Edge cases discutidos

- **Remover horario**: basta tirar do array — todos os componentes que consomem atualizam automaticamente
- **Adicionar horario**: basta incluir no array na posicao correta
- **Horario de almoco**: se o salao fecha ao meio-dia, remova "12:00" do array