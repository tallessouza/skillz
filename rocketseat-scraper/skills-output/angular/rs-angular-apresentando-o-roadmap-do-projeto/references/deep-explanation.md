# Deep Explanation: Roadmap de Projeto Angular — Metodologia GoTask

## Por que layout primeiro?

O instrutor menciona que essa abordagem e "algo bem particular" dele: quando pega um projeto para fazer, primeiro cria o layout dos componentes com valores "chumbados" (hardcoded). A razao por tras disso:

1. **Validacao visual rapida** — voce ve o resultado antes de investir em logica
2. **Responsividade isolada** — resolver Mobile First sem se preocupar com estado
3. **Separacao clara de preocupacoes** — visual e comportamento sao problemas diferentes
4. **Menos retrabalho** — mudar layout depois de ter logica acoplada e custoso

## A importancia da Fase 3 (Fluxo de dados)

O instrutor enfatiza que essa e uma "sessao importantissima" e "mais teorica". O objetivo:

- Desenhar a estrutura da aplicacao visualmente (ele usa Miro)
- Representar quais componentes chamam quais componentes
- Definir como dados fluem entre componentes e services
- **Evitar acoplamento** — componentes nao devem depender diretamente uns dos outros
- **Facilitar manutencao** — facil adicionar funcionalidades no futuro

O instrutor destaca que esses desenhos "voce vai acabar utilizando em projetos reais tambem, futuramente, sao desenhos bem legais e que documentam bem a aplicacao, o funcionamento dela."

## Persistencia como fase final

A persistencia (Local Storage) vem por ultimo deliberadamente:
- Primeiro garante que toda a logica funciona em memoria
- Depois faz "leves refatoracoes" para persistir
- Ao recarregar, a aplicacao faz pre-carregamento automatico do estado salvo

Isso evita o erro comum de acoplar logica de negocio com logica de persistencia desde o inicio.

## Stack tecnica do projeto

- **Angular 19** — versao mais recente
- **Angular Material** — componentes UI (Dialog para modais)
- **Tailwind CSS** — estilizacao utilitaria
- **Prettier** — formatacao consistente de codigo
- **Local Storage** — persistencia client-side

## Funcionalidades do GoTask

O projeto e um gerenciador de tarefas estilo Kanban com:
- Criar tarefa
- Editar tarefa
- Excluir tarefa
- Adicionar/remover comentarios em tarefas
- Drag and drop entre colunas
- Modais (Angular Material Dialog)
- Persistencia no Local Storage