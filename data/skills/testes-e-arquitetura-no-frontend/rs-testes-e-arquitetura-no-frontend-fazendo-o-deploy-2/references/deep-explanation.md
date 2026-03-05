# Deep Explanation: Deploy Next.js + Prisma na Vercel

## Por que o build script precisa do Prisma Generate

Quando o Prisma e configurado localmente, o `prisma generate` cria uma pasta `generated/` que contem o client tipado. Essa pasta e usada em varios locais do projeto para importar tipos e o client do Prisma. Em producao, essa pasta nao existe — o ambiente comeca do zero. Por isso, o build script precisa rodar `prisma generate` antes do `next build`, seguido de `prisma migrate deploy` para aplicar migracoes pendentes no banco de producao.

A ordem `generate → migrate deploy → next build` e importante:
1. **generate** — cria os tipos e o client que o codigo importa
2. **migrate deploy** — aplica migracoes no banco (versao de deploy, nao cria novas migracoes)
3. **next build** — compila a aplicacao, que agora consegue resolver os imports do Prisma

## Vulnerabilidade React Server Components (CVE critico)

O instrutor enfatiza que essa foi uma vulnerabilidade **critica** que afetou diretamente o Next.js por causa dos React Server Components. O problema:

- **O que era:** Remote Code Execution (RCE) — um atacante podia enviar requisicoes manipuladas para a aplicacao e executar comandos arbitrarios no servidor
- **Impacto:** Potencialmente assumir controle total do sistema onde a aplicacao esta hospedada
- **Afetou:** Qualquer framework usando React Server Components, nao apenas Next.js
- **Resposta da Vercel:** Bloqueio automatico de deploys com versoes vulneraveis

O instrutor destaca a importancia de ficar atualizado sobre vulnerabilidades de seguranca. A Vercel ativamente bloqueia deploys com versoes vulneraveis, mostrando uma mensagem clara com link para a documentacao da falha.

## Deploy Preview como ambiente de teste

A Vercel gera automaticamente um deploy preview com URL customizada para cada branch ou PR. O instrutor destaca isso como uma feature muito util:

- Permite testar a aplicacao completa antes de ir para producao
- A URL pode ser compartilhada com usuarios, clientes ou QA
- Funciona como um ambiente de staging automatico
- Cada push na branch atualiza o preview automaticamente

## Prisma Postgres na Vercel

A integracao entre Vercel Storage e Prisma Postgres simplifica muito o setup:

- O banco e criado diretamente no painel da Vercel
- As variaveis de ambiente sao injetadas automaticamente no projeto
- O prefixo da variavel (ex: `DATABASE`) e configurado no connect — a Vercel adiciona `_URL`
- Nao e necessario configurar variaveis de ambiente manualmente

## ESLint e coverage

O pre-push hook roda lint como parte da validacao. A pasta `coverage/` gerada pelos testes pode causar warnings falsos no ESLint. A solucao e simples: adicionar `coverage/**` ao ignores do ESLint config. O instrutor demonstra como validar que o fix funciona: criar uma variavel nao utilizada, rodar lint, verificar que pega o erro real, e depois remover — confirmando que nao e um falso positivo.