---
name: rs-full-stack-criando-primeiro-projeto
description: "Guides creation of a first HTML project in VS Code with proper file structure and conventions. Use when user asks to 'create an HTML project', 'start a web project', 'setup VS Code for HTML', or 'create index.html'. Covers project folder creation, emmet abbreviation, anchor navigation with IDs, and browser preview. Make sure to use this skill whenever setting up a basic HTML project from scratch. Not for advanced build tools, frameworks, or deployment workflows."
---

# Criando Meu Primeiro Projeto HTML

> Crie projetos HTML com estrutura correta, convenções de nomeação e navegação por âncoras desde o primeiro arquivo.

## Prerequisites

- VS Code instalado (versão estável recomendada, não Insiders)
- Navegador web instalado
- Emmet habilitado no VS Code (vem por padrão)

## Steps

### Step 1: Criar pasta do projeto

Criar uma pasta dedicada no computador e abri-la no VS Code arrastando para a janela ou via `File > Open Folder`.

### Step 2: Criar o arquivo index.html

No Explorer do VS Code, clicar no ícone de novo arquivo e nomear `index.html`.

- **Nome:** `index` — convenção padrão para o arquivo principal de qualquer projeto HTML
- **Extensão:** `.html` — define o tipo do arquivo, porque sem ela o editor e o navegador não reconhecem como HTML

### Step 3: Gerar estrutura HTML com Emmet

Digitar `!` e pressionar `Enter` para gerar o boilerplate completo via Emmet abbreviation.

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Site</title>
</head>
<body>
  
</body>
</html>
```

Alterar `lang="en"` para `lang="pt-br"` e definir o `<title>`.

### Step 4: Construir estrutura semântica com navegação por âncoras

```html
<body>
  <nav>
    <a href="#home">Home</a>
    <a href="#blog">Blog</a>
    <a href="#contato">Contato</a>
  </nav>
  <main>
    <section id="home">
      <h1>Bom te ver aqui no meu site</h1>
      <p>Lorem ipsum...</p>
    </section>
    <section id="blog">
      <h2>Meu Blog</h2>
      <p>Lorem ipsum...</p>
    </section>
    <section id="contato">
      <h2>Contato</h2>
      <p>Lorem ipsum...</p>
    </section>
  </main>
</body>
```

### Step 5: Abrir no navegador

Dar dois cliques no arquivo `index.html` no explorador de arquivos do sistema operacional. O navegador padrão abre o arquivo.

## Heuristics

| Situação | Faça |
|----------|------|
| Primeiro arquivo HTML do projeto | Nomeie `index.html`, porque é convenção universal |
| `href="#"` sem ID correspondente | Não ancora em lugar nenhum — use apenas como placeholder |
| `href="#home"` com `id="home"` na section | Ancora corretamente — clique rola até a section |
| Apenas um heading principal na página | Use `h1` — somente um por página para semântica correta |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Criar arquivo sem extensão `.html` | Sempre incluir `.html` para reconhecimento correto |
| Nomear o primeiro arquivo `pagina.html` | Usar `index.html` como convenção padrão |
| Múltiplos `h1` na mesma página | Um `h1` por página, demais seções usam `h2`+ |
| `href="#"` quando quer ancorar em seção | `href="#id-da-secao"` com `id` correspondente |

## Verification

- Arquivo abre no navegador sem erros
- Links de navegação rolam para as seções corretas
- `lang="pt-br"` está definido no `<html>`
- Apenas um `h1` na página

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre convenções, Emmet e ancoragem
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações