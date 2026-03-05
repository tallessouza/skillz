# Deep Explanation: Configurando Campos de Endereço

## Por que fieldset para endereço?

O `<fieldset>` com `<legend>` não é apenas visual — ele agrupa campos semanticamente para leitores de tela. Quando um usuário com acessibilidade entra no fieldset "Endereço residencial", o leitor anuncia o contexto. Isso é especialmente importante em formulários longos com múltiplas seções.

## O padrão flex com proporções

O instrutor usa uma analogia visual de "repartir em três pedaços": imagine a linha dividida em 3 frações. O campo rua recebe `flex: 2` (dois pedaços) e o número recebe `flex: 1` (um pedaço). Isso cria a proporção 2/3 + 1/3 automaticamente, sem calcular porcentagens.

A mesma lógica se aplica a cidade (flex2) + estado (flex1).

### Por que classes utilitárias e não CSS direto?

O instrutor cria `.flex`, `.flex1`, `.flex2` como classes globais reutilizáveis. A decisão é pragmática: esses padrões se repetem em múltiplos fieldsets, então extrair para utilitárias evita duplicação. Não é um framework CSS completo — são apenas 3 classes para um caso concreto.

## Campos disabled: o cenário real

O padrão simula um formulário de CEP automático: o usuário digita o CEP, uma API retorna rua/cidade/estado, e esses campos são preenchidos automaticamente (via `value`) e travados (`disabled`). O campo número permanece habilitado porque a API de CEP não retorna número.

### Por que opacity no wrapper inteiro?

O instrutor usa `.input-wrapper:has([disabled])` com `opacity: 0.5` — isso afeta o label E o input juntos. Se aplicasse opacity só no input, o label ficaria com aparência normal, criando inconsistência visual. O `:has()` permite que o estado do filho (disabled) afete o estilo do pai (wrapper).

### Variável --surface-disabled

O campo disabled recebe `background-color: var(--surface-disabled)` — uma cor de superfície específica do design system. O instrutor nota que essa variável não estava no código inicial e precisou ser adicionada ao `:root` nas globals. Lição: ao trabalhar com design tokens, verifique se todas as variáveis necessárias já foram declaradas.

## Seletor CSS: input:disabled vs input[disabled]

Ambos funcionam, mas `input:disabled` é a pseudo-classe CSS (recomendada) enquanto `input[disabled]` é seletor de atributo. Para o `:has()`, o instrutor usa `[disabled]` (atributo) porque é mais explícito no contexto de "tem esse atributo presente".

## Multi-cursor como técnica de produtividade

O instrutor destaca Cmd+D (Mac) / Ctrl+D (Win/Linux) para selecionar múltiplas ocorrências do mesmo texto. No contexto de formulários, isso é especialmente útil porque `label[for]`, `input[id]` e `input[name]` frequentemente compartilham o mesmo valor. Editar os três de uma vez evita dessincronização.

## Gap vs Margin para espaçamento

O instrutor aplica `gap: 1.25rem` no container flex em vez de margins nos filhos. Vantagens:
- Gap só se aplica ENTRE itens (sem margin extra no primeiro/último)
- Centraliza o controle de espaçamento no pai
- Funciona automaticamente com qualquer número de filhos