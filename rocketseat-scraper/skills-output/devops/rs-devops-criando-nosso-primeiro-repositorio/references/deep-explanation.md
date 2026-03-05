# Deep Explanation: Criando Repositorio para CI/CD

## Por que o primeiro commit importa tanto

O instrutor enfatiza que o setup do repositorio e a base para tudo que vem depois — CI, CD, e ate modulos futuros como Kubernetes e IAC. Um repositorio mal configurado no inicio gera problemas em cascata:

- Cache subido por engano polui o historico e pode quebrar pipelines
- Sem convencao de nome, repositorios se tornam indistinguiveis quando o numero cresce
- Sem SSH configurado, cada push exige autenticacao manual

## Convencao de nomenclatura

O padrao usado e `{organizacao}.{modulo}.{tipo}`:
- **organizacao**: identifica o projeto/empresa (ex: `rocketseat`)
- **modulo**: identifica o contexto do curso/modulo (ex: `ci`, `k8s`, `iac`)
- **tipo**: identifica o que o repositorio contem (ex: `api`, `web`, `infra`)

Isso permite que, ao olhar o nome do repositorio, voce saiba imediatamente o que ele contem e em qual contexto ele se encaixa.

## Reutilizacao entre modulos

O instrutor destaca um padrao importante: a mesma aplicacao (scaffold NestJS) foi usada no modulo de containers e sera reutilizada para CI/CD. Isso reforca que:
- O foco nao e a aplicacao em si, mas os conceitos aplicados sobre ela
- A complexidade sera adicionada incrementalmente ao longo do curso
- O Dockerfile e docker-compose ja criados no modulo anterior sao base para o pipeline

## GitHub Actions como ferramenta integrada

Um ponto chave: o GitHub Actions ja vem integrado ao GitHub, sem necessidade de ferramentas terceiras. O instrutor menciona que:
- A aba "Actions" aparece automaticamente no repositorio
- O GitHub ja sugere actions pre-configuradas baseadas na tecnologia detectada
- Isso reduz a barreira de entrada para CI/CD

## Adaptacao por tecnologia

O instrutor faz uma observacao importante: os **conceitos** de CI/CD sao universais (instalar dependencias, testar, buildar), mas a **implementacao** varia por stack:
- Node: yarn, npm, pnpm
- Java: Maven, Gradle
- O Dockerfile tambem varia por tecnologia

Os preceitos sao imutaveis — instalar, testar, buildar — mas as ferramentas mudam.

## SSH vs HTTPS

O instrutor usa SSH e recomenda configurar a chave SSH. HTTPS funciona mas exige autenticacao repetida. Para quem vai trabalhar com CI/CD (muitos pushes), SSH e a escolha pratica.