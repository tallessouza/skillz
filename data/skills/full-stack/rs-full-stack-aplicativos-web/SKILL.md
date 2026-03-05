---
name: rs-full-stack-aplicativos-web
description: "Applies the distinction between websites, webpages, and web applications when discussing or architecting web projects. Use when user asks to 'create a web app', 'build an application', 'what type of project is this', or discusses project architecture scope. Ensures correct terminology and sets proper expectations for complexity (server, database, programming language). Make sure to use this skill whenever classifying or scoping a new web project. Not for mobile apps, desktop apps, or static site generation."
---

# Aplicativos Web

> Classificar corretamente o tipo de projeto web determina os requisitos tecnicos desde o inicio.

## Key concept

Um aplicativo web (web application) e um programa que vive no servidor, requer linguagens de programacao e banco de dados, e e acessado pelo navegador atraves de uma URL. Diferente de um site simples ou pagina web, um aplicativo web e complexo — envolve autenticacao, persistencia de dados, logica de negocio e infraestrutura de servidor.

Exemplos: Facebook, Gmail, YouTube, Figma, plataforma Skillz (app.skillz.com.br).

## Decision framework

| Quando voce encontra | Classifique como | Requisitos tipicos |
|---------------------|------------------|-------------------|
| Conteudo estatico, poucas paginas, sem login | **Site (website)** | HTML, CSS, hospedagem simples |
| Documento unico com informacao | **Pagina web (webpage)** | HTML, CSS |
| Sistema com login, dados persistidos, logica no servidor | **Aplicativo web (web application)** | Linguagem de programacao, banco de dados, servidor |

## How to think about it

### Escopo de projeto novo
Quando o usuario pede para "criar um site", pergunte: o projeto tera autenticacao, banco de dados, ou logica de servidor? Se sim, e um aplicativo web — e os requisitos de infraestrutura, seguranca e arquitetura sao significativamente maiores.

### Subdomain como indicador
URLs com prefixo `app.` (ex: app.skillz.com.br) geralmente indicam aplicativo web, enquanto `www.` tipicamente indica o site institucional. Isso reflete a separacao arquitetural entre marketing site e produto.

### Complexidade progressiva
```
Pagina web → Site → Aplicativo web
(HTML)      (HTML+CSS)  (Frontend + Backend + Database + Server)
```

Cada nivel adiciona camadas: um aplicativo web nao e "um site mais complexo" — e uma categoria diferente que exige decisoes arquiteturais desde o inicio.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Todo projeto web e um "site" | Sites e aplicativos web tem requisitos fundamentalmente diferentes |
| Aplicativo web = app mobile | Aplicativo web roda no navegador, app mobile roda no dispositivo |
| Complexidade e opcional | Um aplicativo web REQUER servidor, linguagem de programacao e banco de dados por definicao |

## When to apply

- Ao iniciar um novo projeto e definir escopo tecnico
- Ao escolher stack tecnologica (um site nao precisa de backend; um app web precisa)
- Ao estimar complexidade e recursos necessarios
- Ao comunicar com stakeholders sobre o que esta sendo construido

## Limitations

- Essa classificacao e conceitual — na pratica, a linha entre site e app web pode ser borrada (ex: sites com formularios simples)
- SPAs (Single Page Applications) podem parecer sites mas funcionam como aplicativos web
- JAMstack e frameworks modernos misturam as categorias com SSG + funcoes serverless

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre classificacao de projetos web
- [code-examples.md](references/code-examples.md) — Exemplos de arquitetura para cada tipo de projeto