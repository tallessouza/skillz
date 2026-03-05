# Deep Explanation: HTML Forms

## O que são HTML Forms e por que existem

HTML Forms são o mecanismo fundamental de **captura de dados** (input) na web. Toda interação onde o usuário fornece informação — login, busca, cadastro, calculadora, player de vídeo — passa por formulários HTML.

### Input vs Output

O instrutor (Mayk) faz uma distinção clara:
- **Input** = entrada de dados — o que o usuário fornece
- **Output** = saída de dados — o que é apresentado ao usuário

Formulários são a ponte do input. Sem eles, a web seria apenas leitura (output). Com eles, o usuário interage e a página responde.

### Casos de uso mencionados

- Captura de e-mail
- Página de login
- Busca no Google (o campo de pesquisa é um form com GET)
- Calculadora (botões são inputs)
- Player de vídeo (controles são interações via form elements)

## O elemento `<form>`

O `<form>` é um container que agrupa campos de entrada e define duas coisas fundamentais:

### Atributo `action`

Define **para onde** os dados vão quando o formulário é submetido.

- `action="/"` → envia para a mesma página
- `action="/users"` → envia para o endpoint /users
- Omitido → comportamento padrão é enviar para a mesma página (equivalente a `action=""`)

O instrutor enfatiza: mesmo que omitir funcione, declarar explicitamente é melhor para fins didáticos e de clareza.

### Atributo `method`

Define **como** os dados são transmitidos. Está ligado aos **verbos HTTP**.

#### O que é HTTP?

O instrutor explica de forma simples: HTTP é um **protocolo** — um conjunto de regras para transmissão de informação. Dentro do HTTP existem **verbos** que indicam a intenção da requisição.

#### GET — Dados na URL

- É o verbo mais comum — quando você digita `google.com` no navegador, está fazendo um GET
- No contexto de formulários, GET coloca os dados na URL como **query string**
- Formato: `?chave=valor&chave2=valor2`

**Demonstração do instrutor:**
1. Criou um form com `method="GET"` e um input com `name="nome"`
2. Digitou "Mike" e clicou submit
3. A URL mudou para `/?nome=Mike`
4. Se houvesse `action="/user"`, seria `/user?nome=Mike`
5. Se houvesse mais campos (id, filtro), todos apareceriam: `/user?nome=Mike&id=123&filtro=ativo`

**Insight importante:** O front-end pode ler esses dados da URL. Isso é útil para buscas, filtros, e compartilhamento de estado via link.

#### POST — Dados escondidos

- Os dados vão no **body** da requisição HTTP, não na URL
- Importante para **não expor dados sensíveis**
- Requer um back-end que receba e processe esses dados

**Demonstração do instrutor:**
1. Mudou para `method="POST"`
2. Digitou dados e clicou submit
3. Os dados **não apareceram na URL**
4. Sem back-end configurado, os dados "se perdem" — POST precisa de um servidor para processar

**Insight do instrutor:** POST é "um outro momento" — quando o aluno estiver trabalhando com back-end. Para aprendizado de HTML puro, GET é mais visual e didático porque você vê os dados na URL.

## Comportamento padrão

O instrutor demonstra que se você não definir nada:
- `method` padrão = GET
- `action` padrão = mesma página

Ou seja, `<form>` vazio funciona como `<form action="" method="GET">`. Mas o instrutor recomenda deixar explícito para fins de aprendizado.

## O atributo `name` nos inputs

O instrutor menciona brevemente mas é crucial: sem o atributo `name`, o input **não é incluído** na submissão do formulário. O `name` define a **chave** no par chave=valor que é transmitido.

```html
<input type="text" name="nome" />
<!-- Gera: ?nome=valor_digitado -->
```

## Fluxo mental: Front-end → Back-end

```
Usuário preenche form → Submit →
  GET: dados vão na URL (visíveis, front-end pode ler)
  POST: dados vão no body (escondidos, back-end processa)
```

O instrutor posiciona claramente: nas aulas de HTML Forms, o foco é GET para visualizar os dados. POST entra quando o aluno chegar no back-end.

## Setup mencionado

- VS Code Insiders
- Extensão **Live Preview** (Microsoft, ícone azul) — cria servidor local na porta 3000
- Zen Mode para interface limpa
- Arquivo inicial: `form.html`