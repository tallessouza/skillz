# Deep Explanation: Scaffold de Projeto React com Formulários

## Por que usar um template?

O instrutor escolhe deliberadamente pular a criação e estilização do formulário do zero. O raciocínio é pragmático: os alunos já aprenderam a criar formulários HTML, usar inputs, selects e textareas, e já aprenderam a estilizar CSS. Repetir isso seria perda de tempo.

O foco do módulo é **implementação e validação de formulários em React** — não criação de markup. O template serve como ponto de partida padronizado para que todos os alunos tenham a mesma base.

## Estrutura do template

### index.html

O `index.html` é padrão React/Vite — contém o `<div id="root">` onde o React monta o conteúdo dinâmico. O título da página é configurado aqui.

### App.tsx — O formulário

O componente `App` contém um formulário com os seguintes elementos:

1. **Input de texto (nome do evento)** — campo obrigatório, com span de erro associado
2. **Input de data** — para selecionar a data do evento
3. **Select (tema)** — dropdown com opções como "Evento", "Palestra"
4. **Textarea (descrição)** — campo livre para descrever o evento
5. **Botão submit** — tipo `submit` para enviar o formulário

### Classe `.error`

A classe CSS `.error` é usada nos spans de validação:
- `color: red` — destaca a mensagem de erro
- `font-size: 12px` — tamanho menor que o texto normal
- `margin-left: 7px` — pequeno offset para alinhar com o input

Esses spans serão usados nas próximas aulas para exibir mensagens de validação — por exemplo, quando o usuário tenta salvar sem preencher o nome.

## Convenção de nomenclatura do projeto

O instrutor renomeia a pasta baixada para simplificar:
- Remove o sufixo `-main` (adicionado pelo GitHub no download)
- Remove a palavra `template` (porque já não é mais template, é o projeto de trabalho)
- Resultado: `fullstack-react-forms`

Isso é uma boa prática de organização: nomes de pasta devem refletir o que o projeto **é**, não de onde ele **veio**.

## Fluxo de trabalho recomendado

O instrutor demonstra um setup de desenvolvimento eficiente:
1. VS Code aberto com o projeto
2. Terminal integrado do VS Code para comandos
3. Navegador ao lado do VS Code para feedback visual imediato
4. Hot reload do Vite para ver mudanças em tempo real

Esse layout lado-a-lado (editor + navegador) é o padrão para desenvolvimento frontend — permite feedback loop rápido ao modificar código.