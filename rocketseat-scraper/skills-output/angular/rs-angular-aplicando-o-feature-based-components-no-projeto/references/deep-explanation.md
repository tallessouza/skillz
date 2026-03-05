# Deep Explanation: Feature Based Components no Angular

## Filosofia central

A organizacao Feature Based Components abandona a separacao por tipo de arquivo (todas interfaces numa pasta, todos services em outra) e adota separacao por **dominio e funcionalidade**. O instrutor enfatiza que isso e "mais conceitual" — voce precisa pensar no papel de cada arquivo no sistema, nao apenas no seu tipo.

## As 4 camadas e seu raciocinio

### Core
Contem tudo que e instanciado uma unica vez e vive durante todo o ciclo de vida da aplicacao. O instrutor colocou o `TaskService` na core mesmo ele gerenciando apenas tasks, porque ele e o "coracao da aplicacao" — um singleton que poderia ser consumido por futuras features caso a app evolua.

O `ModalControllerService` tambem foi para core porque e injetado em componentes de multiplas camadas (WelcomeSection na core, TaskCard na feature). Colocar na shared criaria dependencia da core com shared, o que nao e desejavel.

### Domain
O instrutor criou domain exclusivamente para tipagens (interfaces, enums, types) que sao compartilhadas entre camadas. A chave e: "quando ela esta aqui no domain, estou falando que ela pode ser utilizada em outros locais — core, shared ou features."

Domain e segregada por feature internamente (`domain/tasks/interfaces/`), mantendo a organizacao por dominio mesmo dentro da camada compartilhada.

### Shared
Apenas utilitarios verdadeiramente genericos. O exemplo foi `generateId()` baseado em timestamp — algo que qualquer feature futura poderia usar sem dependencia de dominio.

### Features (ex: tasks/)
Componentes especificos do dominio. O instrutor moveu `MainContent` para a feature tasks mesmo sendo um componente de layout, porque ele importava `TaskListSection` — e a regra e: **core nunca depende de feature**.

## A decisao critica: MainContent

O instrutor apresentou 4 opcoes para o MainContent (que importava tanto WelcomeSection da core quanto TaskListSection da feature):

1. **Colocar na core** — nao ideal porque criaria dependencia core → feature
2. **Refatorar** — eliminaria o componente, mas nao era o foco
3. **Colocar na shared** — ele nao e reutilizavel, nao faz sentido semantico
4. **Colocar na feature tasks** — escolha final, porque a dependencia mais forte e com a feature

Essa analise mostra que nao existe resposta "certa" universal — depende do contexto e das dependencias reais.

## Nuances importantes mencionadas

- **Separacao por tipos dentro de feature e valida**: `tasks/components/`, `tasks/services/` — o instrutor optou por isso para simplificar, mas mencionou que poderia usar `tasks/widgets/` ou outras convencoes
- **Nao e perfeito na primeira vez**: o instrutor repetiu que isso demanda pratica e que conforme se domina mais Angular (providers, injection tokens), a separacao melhora
- **Correcao de imports e trabalhosa mas necessaria**: apos cada movimentacao, todos os imports precisam ser corrigidos. O instrutor recomendou usar "Add all missing imports" do VSCode, mas com cuidado
- **Escala determina complexidade**: em projetos pequenos, a separacao nao precisa ser extremamente rigida. Em projetos grandes, cada dependencia entre camadas importa

## Conexao com conceitos futuros

O instrutor mencionou que providers e injection tokens do Angular permitirao melhor separacao de responsabilidades no futuro, criando estruturas mais genericas. A Feature Based Components e o fundamento sobre o qual essas tecnicas avancadas se constroem.