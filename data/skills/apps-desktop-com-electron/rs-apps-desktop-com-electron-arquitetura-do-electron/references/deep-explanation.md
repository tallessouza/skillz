# Deep Explanation: Arquitetura do Electron

## Por que essa separacao existe

O instrutor enfatiza repetidamente: se voce ja estudou Electron antes, provavelmente viu tutoriais ensinando a acessar banco de dados diretamente no frontend. Isso era comum porque a propria documentacao antiga do Electron oferecia a opcao `nodeIntegration: true`, que dava acesso as APIs do Node.js dentro do processo Renderer.

O problema: tudo no Renderer e visivel pelo usuario final. Assim como em uma aplicacao web, o usuario pode inspecionar o codigo, interceptar chamadas, ver tokens. Habilitar Node no Renderer e equivalente a dar acesso ao backend inteiro pelo DevTools do Chrome.

## Os tres processos explicados

### Renderer (client-side)
- Funciona **exatamente como um browser**
- Tem acesso as mesmas APIs do browser (DOM, fetch, Web APIs)
- Tem as mesmas permissoes **e as mesmas restricoes**
- O usuario pode ver o codigo (existe ofuscacao, mas nao e seguranca real)
- Analogia do instrutor: "ela funciona exatamente igual como uma aplicacao front-end"

### Main (server-side)
- E o "backend" da aplicacao Electron
- Tem acesso completo ao Node.js: filesystem, banco de dados, rede, processos
- Lida com tudo que e sensivel: autenticacao, pagamentos, tokens secretos
- O instrutor nao da um nome especifico alem de "camada main" — "nao existe necessariamente um nome"

### Preload (ponte)
- Nao e uma camada isolada — executa **dentro do contexto do Renderer**
- Porem tem acesso as APIs do Node.js
- Funcao: ser a ponte segura entre Main e Renderer
- O instrutor tranquiliza: "nao e muita coisa, nao precisa se assustar"
- Na pratica, a maior parte do codigo fica em Renderer e Main; o Preload e minimo

## IPC: comunicacao bidirecional

O instrutor compara com REST na web:
- Na web: frontend faz chamada HTTP → backend responde. Sempre o frontend inicia.
- No Electron: **bidirecional**
  1. Renderer → Main (e recebe resposta) — similar a REST
  2. Main → Renderer (sem o Renderer ter pedido) — push direto
  3. Renderer cria "listeners" para reagir a mensagens do Main

Essa bidirecionalidade e uma diferenca fundamental que o instrutor destaca. O Main pode proativamente enviar dados para o Renderer, algo que na web tradicional exigiria WebSockets ou Server-Sent Events.

## O problema historico (ma pratica legada)

O instrutor "bate muito nessa tecla" porque:
- A documentacao antiga do Electron mostrava `nodeIntegration: true`
- Criou-se "um arsenal, um repertorio de tutoriais" ensinando chamadas de DB no frontend
- Apesar de avisos de seguranca existirem, a facilidade da opcao levou muitos devs pelo caminho errado
- Hoje a recomendacao oficial e **Context Isolation** — Renderer isolado, comunicacao apenas via IPC

## Organizacao no projeto

O instrutor antecipa: "vai estar na sua cara visualmente, separado, as pastinhas, cada um dos processos". A estrutura tipica:

```
src/
├── main/       # Processo Main (backend)
├── renderer/   # Processo Renderer (frontend)
└── preload/    # Script Preload (ponte)
```

## Referencia na documentacao oficial

O instrutor menciona especificamente:
- Secao "Process in Electron" da documentacao
- Secao "Context Isolation" — explica por que nao usar APIs do Node no frontend
- Secao "Inter-Process Communication" — patterns de comunicacao (Renderer→Main, Main→Renderer, Renderer→Renderer)

Sobre Renderer↔Renderer: "geralmente a gente acaba nao fazendo" — e raro e nao recomendado.