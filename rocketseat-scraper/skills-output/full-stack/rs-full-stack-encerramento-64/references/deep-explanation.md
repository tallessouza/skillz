# Deep Explanation: Tailwind CSS — Construção de Aplicação Completa

## Filosofia: Classes utilitárias como linguagem de design

O instrutor demonstra que o Tailwind funciona como um "utilitário baseado em classes que a gente pode customizar". A produtividade vem de não sair do HTML/JSX para estilizar — cada decisão visual é uma classe adicionada diretamente no elemento.

A analogia implícita: Tailwind é como ter um designer inline que responde instantaneamente. Em vez de ir e voltar entre arquivos CSS, você "conversa" com o design diretamente no componente.

## Arquitetura de rotas por papel (role-based routing)

O instrutor organizou a aplicação em três grupos claros:

1. **Auth routes** (signup, signin) — sem layout, sem header
2. **Employee routes** — layout com header de funcionário, acesso a solicitações
3. **Manager routes** — layout com header de gerente, acesso a gerenciamento

### Por que agrupar por papel?

Cada papel tem:
- **Interface diferente** — o manager vê lista com paginação e pesquisa, o employee vê formulário de solicitação
- **Permissões diferentes** — o employee não pode acessar rotas de manager
- **Layouts diferentes** — headers e navegação específicos

### Proteção de rota no cliente

O instrutor mostrou um detalhe importante: quando o usuário tenta acessar uma rota pela URL diretamente (digitando no browser), a aplicação deve **prevenir** a renderização. "Inclusive você viu como prevenir que o usuário tente acessar essa página pela URL. Olha só, ela nem foi para lá, manteve aqui."

Isso é feito com um check no início do componente:
- Verificar o papel do usuário
- Se não tem permissão, redirecionar imediatamente
- Retornar `null` para não renderizar nada

**Edge case importante:** essa proteção é apenas UX — a segurança real deve estar na API. O cliente previne navegação indevida, o servidor previne acesso indevido aos dados.

## Formulários com validação nativa do browser

O instrutor explorou validação HTML5 antes de qualquer JS:
- `type="email"` — "se eu colocar qualquer coisa ele vai falar que esse input é do tipo de e-mail"
- `required` — "com os campos aqui que são obrigatórios"
- Evento `submit` — tanto por Enter quanto por click no botão

### Navegação por teclado

O instrutor mencionou Tab, Shift+Tab e setas para navegar entre campos. Isso reforça: use elementos HTML semânticos (`<form>`, `<input>`, `<button type="submit">`) para que a navegação por teclado funcione nativamente.

## Upload de arquivo

O padrão demonstrado:
1. Input `type="file"` escondido (`hidden` ou `sr-only`)
2. Label ou botão estilizado que dispara o input
3. Ao selecionar, exibe preview ou nome do arquivo
4. Submit envia junto com os outros dados do formulário

## Layouts e reuso

O instrutor enfatizou "aproveitar essas coisas em comum" — headers, navegação e estrutura de página são compartilhados dentro de cada grupo de rotas.

Padrão: componente de Layout que recebe `children` e renderiza a estrutura comum ao redor.

## Paginação e pesquisa

Na interface de gerenciamento (manager), o instrutor implementou:
- **Input de pesquisa** com botão
- **Paginação** com controles de navegação
- **Detalhe via parâmetro** — clicar num item navega para `/refund/:id`
- **Campos read-only** — no detalhe, os inputs mostram dados mas não são editáveis
- **Botão para exibir comprovante** — abre o arquivo de upload

## Fluxo completo da aplicação

```
Sem conta → Signup (formulário com validação)
  → Com conta → Signin
    → Sem role → Página inicial
    → Employee → Solicitação (formulário + upload) → Lista de solicitações
    → Manager → Lista com pesquisa/paginação → Detalhe read-only com comprovante
```