# Deep Explanation: Configurando o Playwright

## Por que separar CI e local?

O instrutor enfatiza que CI e ambiente local tem necessidades opostas. Localmente voce quer velocidade — zero retries, workers ilimitados, timeout curto. No CI voce quer estabilidade — retries extras, worker unico (evita race conditions em recursos compartilhados), timeout maior porque o ambiente e mais lento.

## fullyParallel e workers

`fullyParallel: true` habilita paralelismo a nivel de teste (nao apenas a nivel de arquivo). Combinado com `workers: undefined` localmente, o Playwright usa todos os cores disponiveis. No CI, `workers: 1` garante execucao sequencial para evitar flakiness em ambientes com recursos limitados.

## forbidOnly — protecao contra execucao parcial

Quando voce coloca `test.only()` ou `describe.only()` durante desenvolvimento, e comum esquecer de remover. O `forbidOnly` faz o CI falhar se encontrar qualquer `.only`, garantindo que a suite completa sempre rode em ambientes compartilhados.

## Trace, screenshot e video — a triade de debugging

O instrutor destaca que essas tres features sao "muito, muito boas" do Playwright:

- **trace: 'on-first-retry'** — grava um trace completo (network, DOM, console) apenas na primeira re-execucao apos falha. Util para entender o que aconteceu sem o custo de gravar toda execucao.
- **screenshot: 'only-on-failure'** — captura o estado visual no momento da falha.
- **video: 'retain-on-failure'** — grava video de todos os testes mas mantem apenas os que falharam, economizando espaco.

## baseURL e rotas relativas

Ao configurar `baseURL` no bloco `use`, todos os `page.goto()` podem usar rotas relativas. `page.goto('/')` resolve para `http://localhost:3000/`. Isso torna os testes portaveis entre ambientes (staging, preview deploys) mudando apenas a baseURL.

## webServer — gerenciamento automatico

O `webServer` inicia automaticamente o servidor da aplicacao antes dos testes. Pontos importantes:
- `reuseExistingServer: true` — se ja tem um servidor rodando na porta, usa ele ao inves de subir outro
- No CI usa `npm run start` (build de producao), localmente usa `npm run dev`
- A `PORT` e passada via env para sincronizar com a baseURL

## Mudanca de pasta de testes

O instrutor mostra que ao renomear a pasta (ex: `tests` para `end-to-end`), e preciso atualizar DOIS lugares:
1. `testDir` no config
2. A referencia no `outputDir` se houver

Isso e um erro comum que faz o Playwright nao encontrar os testes.

## UI mode — acompanhamento visual

O `--ui` abre uma interface grafica onde voce ve:
- Testes sendo executados em tempo real
- O browser renderizando frame a frame
- Formularios sendo preenchidos automaticamente
- Requisicoes de network
- Erros visuais facilmente identificaveis

O instrutor destaca que e "sensacional" para debugging e para acompanhar testes de formulario onde voce ve o Playwright digitando e fazendo submit.