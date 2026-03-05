# Deep Explanation: Pipeline de CI com GitHub Actions

## Por que CI complementa left hooks

O instrutor enfatiza um ponto crucial: left hooks (pre-commit, pre-push) podem ser burlados. Um desenvolvedor pode simplesmente comentar o hook e subir codigo sem validacao. A CI no GitHub Actions e a garantia centralizada — nao tem como escapar. O botao de merge so fica verde quando todos os checks passam.

Isso cria duas camadas de protecao:
1. **Left hooks** — feedback rapido local, mas burlavel
2. **CI pipeline** — garantia centralizada, impossivel de burlar

## O processo iterativo de criar CI

O instrutor deliberadamente mostra os erros que acontecem ao criar uma CI do zero. Isso e intencional e pedagogico:

1. **Primeiro erro:** typecheck falhou porque `prisma generate` nao foi executado — os tipos gerados nao existiam na maquina virtual limpa
2. **Segundo erro:** `DATABASE_URL` nao existia como variavel de ambiente na pipeline
3. **Terceiro erro:** build falhou porque nao havia servidor Postgres rodando

Cada erro ensina que a maquina do GitHub Actions e **zerada** a cada execucao. Tudo que existe localmente (banco rodando, tipos gerados, variaveis de ambiente) precisa ser explicitamente configurado.

O instrutor diz: "Se voce ta fazendo do zero, provavelmente voce vai ter que fazer isso algumas vezes. Entao voce vai, sobe, testa, roda, po quebrou, voce vai, ajusta. E um processo um pouquinho moroso inicialmente, mas tem muito ganho."

## Maquina virtual zerada

Conceito fundamental: cada execucao da CI roda em uma maquina virtual Ubuntu completamente nova. Nao ha estado anterior. Por isso:
- Node precisa ser instalado
- Package manager precisa ser instalado
- Dependencias precisam ser instaladas
- Cliente do ORM precisa ser gerado
- Banco de dados precisa ser iniciado como service

## Services com health check

O bloco `services` cria containers Docker auxiliares. O health check e essencial:
- `--health-cmd pg_isready` — comando interno do Postgres que verifica se esta pronto
- `--health-interval 10s` — tenta a cada 10 segundos
- `--health-timeout 5s` — tempo maximo de espera por resposta
- `--health-retries 5` — numero maximo de tentativas

Sem o health check, os steps podem executar antes do banco estar pronto, causando falhas intermitentes.

## CI vs CD

O instrutor faz uma distincao clara:
- **CI (Continuous Integration):** build, testes, lint, typecheck — validacao do codigo
- **CD (Continuous Delivery):** todo o processo desde planejamento ate release — muito mais amplo

A pipeline criada na aula e estritamente CI.

## Dependabot como complemento

O Dependabot cria um ciclo virtuoso:
1. Dependabot detecta atualizacao de dependencia
2. Abre PR automaticamente
3. PR dispara a CI
4. Se CI passa → seguro atualizar
5. Se CI quebra → break change detectado antes de causar problemas

O instrutor mostra um exemplo real do blog dele onde uma atualizacao do Indie v3 para v4 quebrou tanto o deploy da Vercel quanto a CI, detectando break changes antes de chegar em producao.

## Configuracao de reviewers

Alem da CI, o instrutor menciona que e possivel configurar quantidade minima de reviewers no GitHub. Por exemplo, exigir 2 aprovacoes antes de habilitar o merge, independente dos checks da CI estarem passando.