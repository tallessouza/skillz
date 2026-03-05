# Rocketseat Course Transcript Scraper - Discovery

## Data: 2026-02-17
## Status: PIPELINE v3 COMPLETA - ~4,740 VTTs / ~34.8M chars coletados (39 cursos)
## Objetivo: Coletar transcrições de qualquer curso Rocketseat para montar agente de IA

---

## Pipeline Determinística (v3 - VALIDADA)

```
URL do curso (ex: /jornada/full-stack)
    │
    ▼
Extrair journey_slug da URL
    │
    ▼
Login → JWT token (cookie: skylab_next_access_token_v4)
    │
    ▼
GET /v2/journeys/{slug}/content
    │  → Retorna: levels[].contents[].slug
    │  → Filtra: skip quiz-, micro-certificado-, feedback-
    ▼
Para cada content_slug:
GET /journey-nodes/{content_slug}?journey_slug={slug}
    │  → type: "group" → group.lessons[].last.resource (VIDEO_ID)
    │  → type: "cluster" → cluster.groups[].lessons[].last.resource
    ▼
GET https://vz-dc851587-83d.b-cdn.net/{VIDEO_ID}/captions/pt.vtt?ver=1
    │  → VTT público, sem auth necessário!
    ▼
VTT → Texto limpo (remover timestamps, sequências, tags)
    │
    ▼
Salvar: {output}/{course}/{NN}-{slug}/{NNN}-{title}.txt
```

### Resultado Final (Todas as Batches)

| Curso | VTTs | Chars | Batch |
|-------|------|-------|-------|
| full-stack | 1,072 | 4,537,044 | 1 |
| node-js-2023 | 272 | 1,889,070 | 1 |
| machine-learning-em-inteligencia-artificial | 499 | 2,730,003 | 1 |
| next-js | 133 | 1,040,974 | 1 |
| nlw-20-agents | 5 | 289,334 | 2 |
| testes-e-arquitetura-no-frontend | 74 | 623,649 | 2 |
| go | 156 | 1,530,361 | 2 |
| taskmaster | 18 | 114,191 | 2 |
| tecnologias-emergentes | 7 | 48,428 | 2 |
| engenharia-de-prompt | 16 | 57,800 | 2 |
| clean-code | 21 | 168,495 | 3 |
| devops | 223 | 1,959,840 | 4 |
| saa-s-next-js-rbac | 106 | 712,443 | 4 |
| next-js-app-router-e-testes | 41 | 330,006 | 4 |
| **TOTAL BATCHES 1-4** | **~2,643** | **~16,031,638** | — |
| introducao-a-aws | 44 | 438,427 | 5a |
| discover | 70 | 309,638 | 5a |
| kubernetes | 179 | 1,842,507 | 5a |
| seguranca-para-devs | 54 | 572,544 | 5a |
| vue-js | 60 | 207,554 | 5a |
| redes-neurais | 93 | 604,482 | 5a |
| agentes-de-ia-com-n-8-n | 23 | 166,825 | 5a |
| make | 29 | 247,839 | 5a |
| ia-para-dados | 7 | 97,611 | 5a |
| ia-node-marketplace-inteligente | 51 | 394,223 | 5b |
| ruby | 128 | 994,866 | 5b |
| angular | 211 | 1,676,502 | 5b |
| data-analytics | 240 | 2,613,428 | 5b |
| react-native-2025 | 377 | 2,286,674 | 5b |
| c-sharp-avancado-com-dotnet-maui | 232 | 3,434,556 | 5b |
| swift | 206 | 2,040,084 | 5b |
| kotlin | 244 | 1,869,637 | 5c |
| angular-curso-introdutorio | 27 | 176,331 | 5c |
| api-com-bun | 34 | 242,862 | 5c |
| masterizando-o-tailwind | 37 | 278,734 | 5c |
| redux-zustand | 22 | 152,887 | 5c |
| apps-desktop-com-electron | 29 | 271,369 | 5c |
| acessibilidade-com-react-js | 18 | 165,212 | 5c |
| desafio-microservicos-escalaveis | 5 | 288,334 | 6 |
| **TOTAL GERAL** | **~4,740** | **~34,800,000** | — |

### Cursos sem conteúdo de vídeo (0 VTTs)
- NLWs: `nlw-19-connect`, `nlw-16-journey`, `nlw-15-unite`, `nlw-14-expert` (formato diferente)
- Eventos: `cafe-com-instrutores`, `desafio-full-stack-com-ia`, `desafio-agente-de-ia-com-n-8-n-na-pratica`, `nlw-21-pocket-iniciantes`, `desafio-de-angular-na-pratica`, `talent-space-*`, `sua-primeira-api-com-node`, `tech-english-class`
- `masterclass-conhecendo-as-i-as-da-rocketseat` (0 VTTs)

### Cursos Inacessíveis (401 - Plus/Pago)
- `microsservicos-com-node`

---

## Arquitetura da Plataforma

### Hierarquia de Conteúdo

```
Journey (curso)
  └── Level (nível/módulo do curso)
       └── Content (conteúdo dentro do nível)
            ├── type: "group" → tem lessons diretamente
            │    └── group.lessons[].last.resource → VIDEO_ID
            ├── type: "cluster" → container de groups
            │    └── cluster.groups[].lessons[].last.resource → VIDEO_ID
            ├── type: "challenge" → desafio prático (sem vídeo)
            ├── type: "micro-certificate" → certificado (sem vídeo)
            └── type: "quiz" → quiz avaliativo (sem vídeo)
```

### Content slugs a filtrar (sem vídeo)
- `quiz-*` — Quizzes avaliativos
- `micro-certificado-*` — Micro-certificados
- `feedback-*` — Formulários de feedback
- `full-stack-feedback-*` — Feedback específico

### CDN de Vídeo (BunnyCDN / Bunny Stream)
- **Library ID:** `212524`
- **CDN Base:** `vz-dc851587-83d.b-cdn.net`
- **Embed Base:** `iframe.mediadelivery.net`
- **VTTs são PÚBLICOS** — não precisam de auth!

### URLs

| Recurso | Pattern |
|---------|---------|
| Legendas PT | `https://vz-dc851587-83d.b-cdn.net/{VIDEO_ID}/captions/pt.vtt?ver=1` |
| Embed iframe | `https://iframe.mediadelivery.net/embed/212524/{VIDEO_ID}` |
| Playlist HLS | `https://vz-dc851587-83d.b-cdn.net/{VIDEO_ID}/playlist.m3u8` |
| Thumbnail | `https://vz-dc851587-83d.b-cdn.net/{VIDEO_ID}/thumbnail.jpg` |

### API REST (requer auth)
- **Base:** `https://skylab-api.rocketseat.com.br`
- **Auth:** `Authorization: Bearer {JWT}`
- **Token cookie:** `skylab_next_access_token_v4`

#### Endpoints Chave

| Endpoint | Retorna |
|----------|---------|
| `GET /v2/journeys/{slug}/content` | **DISCOVERY** — levels[].contents[] com slugs |
| `GET /v2/journeys/{slug}/details` | Metadados (título, educadores, stats) |
| `GET /journey-nodes/{slug}?journey_slug={journeySlug}` | **DATA** — Aulas com video IDs, type (group/cluster) |

#### Estrutura: type "group"
```json
{
  "type": "group",
  "group": {
    "lessons": [{
      "type": "video",
      "last": {
        "title": "...",
        "resource": "VIDEO_ID",
        "has_transcription": true,
        "duration": 232
      }
    }]
  }
}
```

#### Estrutura: type "cluster"
```json
{
  "type": "cluster",
  "cluster": {
    "title": "...",
    "slug": "...",
    "groups": [{
      "title": "Section Title",
      "slug": "section-slug",
      "lessons": [{
        "type": "video",
        "last": {
          "title": "...",
          "resource": "VIDEO_ID",
          "has_transcription": true
        }
      }]
    }]
  }
}
```

---

## Cursos Coletados (14 cursos)

### Journey Slugs

| Curso | Slug | VTTs |
|-------|------|------|
| Full-Stack | `full-stack` | 1,072 |
| Node.js 2023 | `node-js-2023` | 272 |
| Machine Learning | `machine-learning-em-inteligencia-artificial` | 499 |
| Next.js | `next-js` | 133 |
| NLW 20 Agents | `nlw-20-agents` | 5 |
| Testes e Arquitetura Frontend | `testes-e-arquitetura-no-frontend` | 74 |
| Go | `go` | 156 |
| Taskmaster | `taskmaster` | 18 |
| Tecnologias Emergentes | `tecnologias-emergentes` | 7 |
| Engenharia de Prompt | `engenharia-de-prompt` | 16 |
| Clean Code | `clean-code` | 21 |
| DevOps | `devops` | 223 |
| SaaS Next.js RBAC | `saa-s-next-js-rbac` | 106 |
| Next.js App Router + Testes | `next-js-app-router-e-testes` | 41 |

---

## Uso do Script (v3)

```bash
# Um curso
python3 scraper.py \
  --courses full-stack \
  --token "eyJ..." \
  --output ./transcricoes

# Múltiplos cursos
python3 scraper.py \
  --courses full-stack node-js-2023 machine-learning-em-inteligencia-artificial next-js \
  --token "eyJ..." \
  --rate-limit 0.3

# A partir de URL
python3 scraper.py \
  --course-url "https://app.rocketseat.com.br/jornada/full-stack" \
  --token "eyJ..."
```

---

## Catálogo Completo Descoberto (2026-02-16)

### Método de Discovery

Não existe endpoint REST para listar todos os cursos. A plataforma usa Next.js App Router (RSC).
Discovery feito via Playwright navegando:
1. `/catalogo/contexto/tipo/course` — 12 cursos
2. `/catalogo/contexto/tipo/event` — 11 eventos
3. `/catalogo/explorar` — 21 slugs únicos
4. `/catalogo/contexto/tag/{tag}` — tags variadas (mais produtivo)

### Slugs Já Coletados (14)

```
full-stack, node-js-2023, machine-learning-em-inteligencia-artificial, next-js,
nlw-20-agents, testes-e-arquitetura-no-frontend, go, taskmaster,
tecnologias-emergentes, engenharia-de-prompt, clean-code, devops,
saa-s-next-js-rbac, next-js-app-router-e-testes
```

### Slugs NOVOS — Do Catálogo (16)

```
introducao-a-aws, discover, kubernetes, seguranca-para-devs, vue-js,
redes-neurais, agentes-de-ia-com-n-8-n, make, ia-para-dados,
ia-node-marketplace-inteligente, ruby, angular, data-analytics,
react-native-2025, c-sharp-avancado-com-dotnet-maui, swift
```

### Slugs NOVOS — De Tags (12)

```
kotlin, angular-curso-introdutorio, api-com-bun,
masterclass-conhecendo-as-i-as-da-rocketseat, masterizando-o-tailwind,
redux-zustand, apps-desktop-com-electron, acessibilidade-com-react-js,
nlw-19-connect, nlw-16-journey, nlw-15-unite, nlw-14-expert
```

### Eventos (10)

```
cafe-com-instrutores, desafio-full-stack-com-ia,
desafio-agente-de-ia-com-n-8-n-na-pratica, nlw-21-pocket-iniciantes,
desafio-de-angular-na-pratica, talent-space-setembro-2025,
sua-primeira-api-com-node, desafio-microservicos-escalaveis,
tech-english-class, talent-space-junho-2025
```

### Bloqueados (401 — Plus/Pago)

- `microsservicos-com-node`
- Tags `design-patterns`, `solid` (parcial), `clean-architecture` (parcial) apontam para conteúdo Plus

### Comando para Scrape Batch 5 (NOVOS — cursos + tags)

```bash
python3 scraper.py \
  --courses \
    introducao-a-aws discover kubernetes seguranca-para-devs vue-js \
    redes-neurais agentes-de-ia-com-n-8-n make ia-para-dados \
    ia-node-marketplace-inteligente ruby angular data-analytics \
    react-native-2025 c-sharp-avancado-com-dotnet-maui swift \
    kotlin angular-curso-introdutorio api-com-bun \
    masterclass-conhecendo-as-i-as-da-rocketseat masterizando-o-tailwind \
    redux-zustand apps-desktop-com-electron acessibilidade-com-react-js \
    nlw-19-connect nlw-16-journey nlw-15-unite nlw-14-expert \
  --token "eyJ..." \
  --output ./transcricoes \
  --rate-limit 0.3
```

### Comando para Scrape Batch 6 (EVENTOS)

```bash
python3 scraper.py \
  --courses \
    cafe-com-instrutores desafio-full-stack-com-ia \
    desafio-agente-de-ia-com-n-8-n-na-pratica nlw-21-pocket-iniciantes \
    desafio-de-angular-na-pratica talent-space-setembro-2025 \
    sua-primeira-api-com-node desafio-microservicos-escalaveis \
    tech-english-class talent-space-junho-2025 \
  --token "eyJ..." \
  --output ./transcricoes \
  --rate-limit 0.3
```

---

## Sistema de Tags (Discovery via Catálogo)

URL pattern: `https://app.rocketseat.com.br/catalogo/contexto/tag/{tag}`

Tags exploradas:
- `solid` → node-js-2023, plus
- `clean-architecture` → kotlin, node-js-2023, plus
- `design-patterns` → somente Plus
- `ddd` → dentro de node-js-2023 (já coletado)
- `docker` → devops, nlw-16-journey, nlw-15-unite
- `ci-cd` → devops, nlw-16-journey, nlw-15-unite
- `nlw` → nlw-21-pocket-iniciantes, nlw-20-agents, nlw-19-connect, nlw-18-pocket-mobile
- `fastify` → nlw-14-expert, nlw-15-unite, nlw-16-journey
- `node-js` → clean-code, saa-s-next-js-rbac, api-com-bun, masterclass-conhecendo-as-i-as-da-rocketseat
- `typescript` → angular-curso-introdutorio, api-com-bun, redux-zustand, apps-desktop-com-electron
- `arquitetura` → microsservicos-com-node (401), clean-code, plus

### Insight: SOLID/DDD/Design Patterns

Conteúdo sobre SOLID, DDD e Design Patterns está **dentro** de cursos já coletados:
- **node-js-2023** (272 VTTs) — SOLID aplicado, Clean Architecture, DDD
- **clean-code** (21 VTTs) — SOLID, DDD introdutório, naming, conditionals
- Não existem cursos dedicados separados (exceto Plus)

## Falta Fazer

- [x] Buscar NLWs e eventos (via tags)
- [x] Cursos de boas práticas, SOLID, arquitetura
- [x] Catalogar TODOS os slugs disponíveis (53 total)
- [x] Rodar Batch 5 (28 cursos novos) — COMPLETO 2026-02-17
- [x] Rodar Batch 6 (10 eventos) — COMPLETO (maioria sem vídeo)
- [x] Fix bug slug com espaço (urllib.parse.quote)
- [ ] Login automático via Playwright para obter token
- [ ] Pipeline de pós-processamento (chunking, embeddings)
- [ ] Transformar em squad
- [ ] Alguns slugs podem retornar 401 — documentar quais

---

## Riscos
- Acesso gratuito expira em **18/02/2026** (amanhã!)
- Token JWT expira (precisa refresh)
- Alguns vídeos não têm caption (has_transcription: false)
- `NO CAPTION` — 25 vídeos no curso de ML não tinham legenda
- Cursos Plus retornam 401 (microsservicos-com-node)
- Alguns slugs do catálogo podem ser "formações" (container de cursos) e não journeys diretos
