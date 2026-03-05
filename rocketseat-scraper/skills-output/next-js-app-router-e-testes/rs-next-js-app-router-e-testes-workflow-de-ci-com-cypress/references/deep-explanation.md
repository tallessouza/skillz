# Deep Explanation: Workflow de CI com Cypress

## Por que separar a API do frontend?

O Diego explica o problema central: quando a aplicacao Next.js tem route handlers internos (`app/api/`), o processo de `next build` precisa acessar essa API para fazer a pre-renderizacao das paginas (SSG/ISR). Mas durante o build, a aplicacao ainda nao esta rodando — entao a API nao existe.

Isso cria um ciclo: preciso da API para buildar, mas preciso buildar para ter a API.

A solucao e extrair a API para um projeto separado e fazer deploy independente (Vercel, por exemplo). Assim a API esta sempre online, independente do estado do frontend.

> "Isso é até um dos motivos para a gente não criar o back-end da nossa aplicação aqui dentro do próprio Next."

O Diego reconhece que a API dentro do Next.js foi uma escolha educacional, nao arquitetural.

## Por que ignorar ESLint e TypeScript no build?

O Diego defende uma opiniao pessoal: erros de ESLint e TypeScript nao devem bloquear o build. Eles devem ser resolvidos antes do codigo chegar na branch main.

> "Eu não quero que um erro de ESLint ou erro de TypeScript influencie no processo de build, porque esses erros de ESLint e Typescript devem ser tratados antes do código ser mergeado."

A logica: se o codigo chegou no build, ja passou pelo review e lint check. O build nao deveria ser o lugar para pegar esses erros.

## Cache do pnpm no CI

O workflow usa 3 steps para cache:

1. **Get store path** — descobre onde o pnpm guarda os pacotes baixados
2. **Setup cache** — usa `actions/cache` para salvar/restaurar essa pasta, com key baseada no hash do `pnpm-lock.yaml`
3. **Install dependencies** — se o lock nao mudou, dependencias vem do cache; se mudou, instala do zero

> "Se ele não mudar, não tem porquê eu instalar as dependências, eu posso simplesmente pegar o cache da última vez que as minhas actions foram executadas e reaproveitar."

A primeira execucao sempre tera "cache not found", mas as seguintes serao significativamente mais rapidas.

## Por que `run_install: false`?

O step de instalar o pnpm usa `run_install: false` para NAO rodar `pnpm install` automaticamente. Isso porque entre a instalacao do pnpm e o `pnpm install`, existe o step de cache. Se instalasse tudo junto, nao aproveitaria o cache.

## Build + Start vs Dev

No CI, a Cypress Action recebe `build: pnpm run build` e `start: pnpm start`. Nunca usar `dev` porque:
- `dev` nao faz pre-renderizacao
- `dev` tem hot reload e overhead desnecessario
- O CI deve simular o ambiente de producao exatamente

## Variaveis ambiente no CI

As variaveis ambiente sao declaradas no step do Cypress com `env:`. O `APP_URL` aponta para `localhost:3000` porque a app esta rodando no proprio runner do Ubuntu. O `NEXT_PUBLIC_API_BASE_URL` aponta para a API deployada externamente.

## Ubuntu com versao especifica

> "Eu gosto de especificar uma versão porque assim a gente garante que o ambiente sempre vai ser o mesmo."

O Diego usa `ubuntu-22.04` ao inves de `ubuntu-latest` para garantir reproducibilidade. O `latest` pode mudar e quebrar o CI sem nenhuma mudanca no codigo.

## Resultado no GitHub

Apos o workflow executar, o GitHub mostra:
- Check verde/vermelho em cada commit
- Summary com duracao, testes passados, falhados, pendentes e pulados
- Em PRs, o mesmo processo roda automaticamente a cada novo commit