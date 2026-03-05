# Deep Explanation: Ferramentas e Ambiente

## Por que VS Code Insiders nao e recomendado

O instrutor (Mayk) usa o Insiders especificamente porque seu VS Code normal "tem muita sujeira" — extensoes, configs, projetos. O Insiders serve como um ambiente limpo para demonstracao. Ele deixa claro: "Nao e muito interessante para voce usar no seu dia a dia, porque pode ser que venha novidades que ainda estao em fase experimental."

A licao implicita: **ter um ambiente limpo e mais importante que ter o editor mais atualizado.** Se seu VS Code esta poluido, crie um novo profile em vez de migrar para o Insiders.

## Filosofia do Ambiente Minimalista

Mayk remove deliberadamente todas as extensoes exceto o Copilot e faz reload. A mensagem e clara: comece do zero. Cada extensao que voce adiciona deve justificar sua presenca. Isso se aplica especialmente ao contexto de aprendizado — extensoes que formatam, corrigem ou autocompletam podem mascarar erros que voce precisa aprender a identificar.

## Zen Mode — O Proposito

As configuracoes de Zen Mode removem:
- **Activity Bar** (`hideActivityBar: true`) — os icones laterais somem
- **Line numbers** (`hideLineNumbers: true`) — foco no codigo, nao na linha
- **Tabs** (`showTabs: "none"`) — trabalhe em um arquivo por vez
- **Notificacoes** (`silentNotifications: true`) — zero distracao

Configuracoes que Mayk NAO ativa:
- **Center layout** (`false`) — codigo ocupa toda a largura, nao fica centralizado
- **Full screen** (`false`) — permite ainda ver outras janelas/taskbar

Isso mostra uma preferencia por "limpo mas nao isolado" — voce ainda pode navegar, mas o editor em si e minimalista.

## GitHub Copilot — Acesso e Modelo

### Acesso para alunos Skillz
Parceria GitHub + Skillz = Premium Request tokens para todos os alunos. Isso significa acesso a modelos mais avancados alem do gratuito.

### Por que "Auto" e suficiente
Mayk diz: "Escolher modelo tambem nao e o foco que nos queremos aqui. O Auto vai, com certeza, suprir todas as suas necessidades." A mensagem e sobre prioridades — gastar tempo escolhendo entre GPT-4o, Claude, etc. e otimizacao prematura quando voce esta aprendendo a usar a ferramenta.

## Mentalidade do Instrutor

A frase chave: "Nao se preocupe com isso agora. Foco naquilo que vai fazer voce aprender."

Isso reflete uma pedagogia de **reducao de carga cognitiva** — eliminar decisoes desnecessarias para que o aluno concentre energia mental no que importa. O ambiente e a ferramenta, nao a ferramenta como objeto de estudo.

## Contexto do Projeto

Mayk abre um projeto de NLW (Next Level Week) anterior como base para demonstracao. O projeto em si nao importa — o que importa e ter um codebase real para praticar o uso de IA. Isso reforça: **aprenda com codigo real, nao com exemplos artificiais.**