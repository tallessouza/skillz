---
name: rs-discover-abrindo-o-projeto-na-web
description: "Applies correct local development server setup when working with HTML/CSS projects. Use when user asks to 'open project in browser', 'preview HTML', 'start live server', 'run local server', or 'view website locally'. Explains file:// vs http:// protocols, localhost, IP addresses, and ports. Make sure to use this skill whenever setting up local development environments for static sites. Not for production deployment, Docker, or backend server configuration."
---

# Abrindo o Projeto na Web

> Sempre use um servidor local (Live Server) para visualizar projetos web — nunca abra arquivos HTML diretamente pelo sistema de arquivos.

## Rules

1. **Nunca use file:// para desenvolvimento** — `file:///Users/...` nao simula um servidor real, porque muitas APIs do browser (fetch, modules, CORS) nao funcionam com protocolo file
2. **Use Live Server no VS Code** — botao direito no arquivo → "Open with Live Server", porque ele cria um servidor HTTP local com hot reload
3. **Entenda o endereco local** — `127.0.0.1` (localhost) e o IP da sua propria maquina simulando um servidor, porque todo desenvolvimento web precisa de HTTP
4. **Portas sao como comodos** — `:5500` e a porta padrao do Live Server, como uma porta especifica dentro do "edificio" do servidor
5. **HTTP vs HTTPS** — HTTP (porta 80) transfere hipertexto, HTTPS (porta 443) faz o mesmo com criptografia

## How to setup

### VS Code com Live Server

```
1. Instalar extensao "Live Server" no VS Code
2. Abrir pasta do projeto no VS Code
3. Botao direito no index.html → "Open with Live Server"
4. Browser abre: http://127.0.0.1:5500/index.html
```

### Resultado esperado

```
# ERRADO (protocolo file)
file:///Users/nome/projeto/index.html

# CORRETO (protocolo HTTP via Live Server)
http://127.0.0.1:5500/index.html
```

## Key concepts

| Conceito | O que e | Analogia |
|----------|---------|----------|
| Protocolo | Conjunto de regras para transferencia | Idioma que duas maquinas falam |
| HTTP | HyperText Transfer Protocol | Regras para transferir HTML/CSS/JS |
| HTTPS | HTTP + Secure | Mesmas regras, mas com criptografia |
| IP (127.0.0.1) | Endereco numerico do servidor | Endereco da casa |
| Porta (:5500) | Canal especifico no servidor | Comodo dentro da casa |
| Dominio (google.com) | Nome amigavel para um IP | Apelido do endereco |
| localhost | Apelido para 127.0.0.1 | "Minha propria maquina" |

## Decision framework

| Situacao | Faca |
|----------|------|
| Projeto HTML/CSS simples | Live Server no VS Code |
| Projeto com framework (React, Next) | `npm run dev` (ja tem servidor embutido) |
| Precisa testar em outro dispositivo na rede | Use o IP da rede local, nao 127.0.0.1 |
| Arquivo abriu com file:// | Pare, use Live Server |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Dois cliques no .html no explorador de arquivos | Open with Live Server no VS Code |
| Usar `file:///` para desenvolvimento | Usar `http://127.0.0.1:5500/` |
| Ignorar erros de CORS com file:// | Servir via HTTP onde CORS funciona |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre protocolos, IP, portas e DNS
- [code-examples.md](references/code-examples.md) — Exemplos praticos de configuracao e troubleshooting