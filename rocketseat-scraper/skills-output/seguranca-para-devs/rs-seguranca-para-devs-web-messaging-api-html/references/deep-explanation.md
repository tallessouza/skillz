# Deep Explanation: Web Messaging API — Seguranca

## O que e a Web Messaging API

A Web Messaging API (postMessage) do HTML5 permite comunicacao entre janelas e iframes. Casos de uso tipicos:

- **Chatbot em iframe** — um assistente que roda em subdominio diferente precisa saber em que pagina o usuario esta, receber saldo, nome, etc.
- **Aplicacao multi-janela** — duas janelas abertas que interagem entre si
- **Microservicos frontend** — cada servico em um subdominio, comunicando via postMessage

## O ataque passo a passo

### Fase 1: Embedding da aplicacao vitima

O atacante cria uma pagina em `hacker.com` e simplesmente inclui a aplicacao vitima em um iframe:

```html
<!-- hacker.com/hacker1.html -->
<iframe src="https://meusite.com/index.html"></iframe>
```

Se a aplicacao nao usa `frame-ancestors` no CSP, ela sera carregada normalmente dentro do iframe do atacante.

### Fase 2: Injecao de iframe malicioso

O atacante envia uma mensagem via postMessage contendo codigo que cria um novo iframe dentro da aplicacao vitima. Se a aplicacao usa `eval(event.data)`, o codigo e executado.

O iframe malicioso e inserido antes do iframe legitimo. Como o codigo da aplicacao faz `querySelector('iframe')` (pega o primeiro), agora todas as mensagens vao para o iframe do atacante.

### Fase 3: Interceptacao silenciosa

O atacante pode:
- Colocar o iframe malicioso com `opacity: 0` e `position: absolute` para ficar invisivel
- Receber todas as informacoes que a aplicacao enviava ao chatbot (saldo, nome, cliques, paginas visitadas)
- O usuario nao percebe nada — continua usando a aplicacao normalmente

### Por que eval amplifica o problema

Sem eval, mesmo que um iframe seja comprometido, ele so pode enviar mensagens de texto. A aplicacao pai decide o que fazer com cada mensagem.

Com eval, qualquer mensagem recebida vira codigo executavel. Um iframe comprometido pode:
- Criar novos iframes
- Redefinir funcoes (`window.send = function() { ... }`)
- Acessar o DOM inteiro da pagina pai
- Exfiltrar dados para servidores externos

O instrutor enfatiza: "Se a gente nao tivesse usado eval, a vida do hacker teria sido muito mais difícil."

### O problema do includes na validacao

O atacante pode registrar qualquer subdominio em seu proprio dominio:

```
meusite.com.hacker.com  ← controlado pelo atacante
chat.meusite.com.hacker.com  ← controlado pelo atacante
```

Se voce valida com `event.origin.includes('meusite.com')`, ambos passam na validacao. O atacante so precisa criar um subdominio que contenha o texto que voce verifica.

### Validacao correta de origem

A validacao deve garantir que o dominio **termina** com `.meusite.com` (com o ponto antes) ou **e exatamente** `meusite.com`. Isso impede dominios como `hackermeusite.com` (sem ponto antes) e `meusite.com.hacker.com` (nao termina com meusite.com).

A melhor abordagem e whitelist: uma lista exata de origens permitidas, comparada com igualdade estrita.

## Defesas em camadas

1. **frame-ancestors no CSP** — impede que sua pagina seja carregada em iframes de terceiros (primeira linha de defesa)
2. **Origem especifica no postMessage** — garante que mensagens so chegam ao destino correto
3. **Whitelist na recepcao** — garante que so mensagens de origens conhecidas sao processadas
4. **Nunca eval** — garante que mesmo mensagens aceitas nao podem executar codigo arbitrario
5. **Acoes restritas (switch/if)** — garante que mesmo um remetente legitimo comprometido so pode fazer o que voce permitiu

## Analogia do instrutor

Pense no chatbot como um assistente com permissoes limitadas. Se o assistente for comprometido (sequestrado), ele so pode fazer o que voce deu permissao. Se voce deu eval (carta branca), o atacante pode fazer qualquer coisa. Se voce restringiu a acoes especificas (add, remove), o dano e limitado.