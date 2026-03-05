---
name: rs-angular-visao-backend
description: "Applies backend architecture patterns for Node.js/Express APIs with JSON-based persistence and JWT auth. Use when user asks to 'create an API', 'build a backend', 'setup Express server', 'implement JWT authentication', or 'organize API endpoints'. Covers feature-based architecture, file-system storage over base64, auth middleware, and RESTful endpoint design. Make sure to use this skill whenever designing or reviewing Node.js API structure with Express. Not for frontend components, Angular-specific code, or database migration tasks."
---

# Visao das Caracteristicas do Back-end

> Organize APIs em arquitetura Feature-Based com persistencia em JSON, storage binario no filesystem, e seguranca via JWT middleware.

## Key concept

Uma API REST para gerenciar recursos (users, movies, favorites) usando Node.js + Express + TypeScript, com arquitetura Feature-Based (Domain Driven Design simplificado). Dados persistidos em arquivos JSON locais, imagens salvas como binario no disco (nunca base64), autenticacao via JWT com middleware interceptador.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa persistir dados sem banco real | JSON files em `server/data/*.json`, isolados do source |
| Precisa salvar imagens/uploads | Binario no filesystem via multer, servido estaticamente pelo Express — nunca base64 |
| Endpoint precisa ser protegido | Auth middleware que valida JWT e injeta dados do usuario tipados na request |
| Upload de imagem com dados | Multi-part form data com multer, validando tipo de arquivo e gerando nomes unicos |
| Organizar rotas e logica | Feature-Based: separar por contexto (users/, movies/, favorites/), nao por tipo tecnico |

## Rules

1. **Nunca salve imagens em base64** — base64 aumenta o tamanho em 33%, dificulta cache do navegador, e infla o JSON de persistencia. Salve o binario no disco e armazene apenas o caminho relativo
2. **Isole dados do codigo-fonte** — pasta `data/` (JSON) e `public/` (assets) ficam fora de `src/`, garantindo seguranca e organizacao
3. **Proteja endpoints com auth middleware** — JWT com validade curta (1h), middleware decodifica token e injeta usuario tipado na request. Endpoints privados exigem token no header
4. **Sanitize respostas de usuario** — nunca retorne senha no response, mesmo hasheada
5. **Valide duplicidade no cadastro** — verificar email duplicado antes de criar usuario
6. **Use media ponderada incremental para ratings** — atualize nota media e total de votos em tempo real, retornando valores atualizados no response

## How to think about it

### Arquitetura Feature-Based
Separar responsabilidades por contexto de dominio, nao por camada tecnica. Cada feature (users, movies, favorites) contem suas rotas, controllers e logica propria. Isso reflete o Domain Driven Design em escala simples.

### Storage de imagens
O fluxo correto: frontend envia multi-part form data → multer processa upload → valida se e imagem → gera nome unico → salva binario na pasta public → armazena caminho relativo no JSON. O Express serve a pasta public estaticamente, permitindo acesso direto via URL.

### Join logico entre arquivos JSON
Sem banco relacional, joins sao feitos em codigo. Exemplo: favoritos armazena apenas IDs de filmes. Para listar favoritos completos, busca IDs em `favorites.json` e cruza com dados de `movies.json`.

## Endpoint design pattern

### Recursos e verbos HTTP

```
POST   /users              → Criar usuario (valida duplicidade email)
POST   /users/login        → Autenticar (retorna JWT + dados sanitizados)

GET    /movies             → Listar todos (requer token)
GET    /movies/:id         → Detalhe por ID (requer token)
POST   /movies             → Cadastrar com imagem (requer token, multipart)
POST   /movies/:id/rate    → Avaliar 1-5 (requer token, media incremental)

GET    /favorites           → Listar favoritos do usuario logado (join logico)
POST   /favorites/:movieId  → Adicionar aos favoritos
DELETE /favorites/:movieId  → Remover dos favoritos
```

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Base64 e pratico para imagens | Aumenta 33% o tamanho, dificulta cache, infla JSON |
| JSON files nao servem como banco | Para desenvolvimento local e prototipagem, simulam banco perfeitamente |
| Todos endpoints devem ser publicos durante dev | Mesmo em dev, proteja com JWT para testar fluxo real de autenticacao |
| Rating e so salvar a nota | Precisa de media ponderada incremental (nota media + total de votos) |

## Limitations

- JSON como banco nao escala para producao — usar apenas para desenvolvimento local e prototipagem
- File system storage local nao funciona em ambientes serverless reais (sem disco persistente)
- JWT com validade de 1h exige estrategia de refresh para UX em producao

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
