# Deep Explanation: Setup de Template HTML/CSS

## Por que usar um template pronto?

O instrutor traz o HTML e CSS prontos para que o aluno foque exclusivamente no JavaScript, que e o objetivo da etapa do curso. Isso elimina a fricção de construir UI e permite ir direto para a lógica de programação.

A separação é intencional: o template é a "casca" visual, e o JavaScript vai "dar vida" — sem JS, clicar em "Agendar" não faz nada, os horários não funcionam, a lista de agendamentos não aparece.

## Duas formas de obter o template

1. **"Use this template"** no GitHub — cria um repositório novo na sua conta, já com histórico limpo (sem os commits do template original). Ideal para quem quer versionar o projeto desde o início.

2. **Download ZIP** — mais simples, sem necessidade de conta GitHub configurada. O instrutor escolheu essa opção na demonstração.

O instrutor enfatiza que ambas são válidas. Clone direto (`git clone`) também funciona, mas o "Use this template" é preferível porque gera um repo independente.

## Organização de pasta

O instrutor renomeia a pasta removendo o sufixo `-main` ou `-template` que o GitHub adiciona automaticamente no ZIP. Isso mantém o nome limpo (`hairday` em vez de `hairday-template-main`).

Ele também move o projeto para uma pasta organizada (`js/`), reforçando boas práticas de organização do workspace.

## Estrutura CSS do template

O template usa uma estratégia de CSS modular:
- Cada componente/seção tem seu próprio arquivo `.css`
- Um `index.css` centraliza todas as importações com `@import`
- O `index.html` importa apenas o `index.css`

Isso facilita manutenção sem precisar de bundler.

## Dica de busca no VS Code

O instrutor aproveita para ensinar uma correção real (letra maiúscula em "Noite") usando a busca global do VS Code (`Ctrl+Shift+F`). Mostra que:
- A busca lista resultados por arquivo em hierarquia
- Você pode clicar no resultado para ir direto à linha
- `Ctrl+F` busca apenas no arquivo atual
- A ferramenta de busca é essencial para navegar projetos maiores

## Contexto da aplicação Hair Day

A aplicação é um sistema de agendamento para salão de cabelo:
- **Usuário:** funcionário do salão (não o cliente)
- **Funcionalidades:** selecionar data, escolher horário (manhã/tarde/noite), informar nome do cliente, agendar, listar agendamentos, cancelar agendamento
- O instrutor sugere que o aluno poderia estender para uso pelo cliente também

Atualmente o template tem apenas o visual — todos os botões e formulários são inertes sem JavaScript.