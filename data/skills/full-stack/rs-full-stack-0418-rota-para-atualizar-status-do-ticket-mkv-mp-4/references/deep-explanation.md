# Deep Explanation: Rota para Atualizar Status do Ticket

## Por que PATCH e nao PUT?

O instrutor explica com clareza: **"o metodo PATCH e utilizado quando a gente quer modificar uma informacao especifica"**. A distincao e fundamental:

- **PUT** = substituicao completa do recurso. Voce envia o objeto inteiro e o servidor substitui.
- **PATCH** = modificacao parcial. Voce altera apenas o campo necessario.

No caso de fechar um ticket, voce nao quer alterar titulo, descricao, autor — apenas o `status`. Entao PATCH e semanticamente correto.

### Analogia pratica
PUT e como reescrever um documento inteiro para corrigir um paragrafo. PATCH e como usar a borracha so naquele paragrafo.

## Design de sub-rota: por que `/tickets/:id/close`?

O instrutor compoe a rota assim: `/:id/close`. Isso segue o padrao de **sub-recurso de acao**:

```
/recurso/:id/acao
```

Vantagens:
1. **Autodocumentavel** — qualquer dev lendo a rota entende a intencao
2. **Sem ambiguidade** — nao depende do body para saber o que vai acontecer
3. **Extensivel** — amanha voce pode ter `/tickets/:id/reopen`, `/tickets/:id/archive`

### Por que nao passar status no body?

O instrutor enfatiza: **"a gente nao precisa enviar nada aqui no corpo da requisicao, porque la o que a gente vai fazer na nossa API e atualizar o status para encerrado"**.

Quando a acao e fixa (close = status fechado), colocar no body e redundancia. A rota ja carrega a semantica.

## Controller dedicado: separacao por acao

O instrutor cria `updateStatus.js` separado do `update.js` existente. Isso segue o principio de responsabilidade unica:

- `update.js` → atualiza dados do ticket (titulo, descricao)
- `updateStatus.js` → muda apenas o status

Cada controller faz uma coisa. Quando a logica de fechar ticket ficar complexa (notificacoes, validacoes, historico), o arquivo ja esta isolado.

## Importacao com .js no Node.js ESM

O instrutor reforça: **"sempre confirmando aqui se fez a importacao utilizando o .js"**. No Node.js com ES Modules, a extensao e obrigatoria. Sem ela, o import falha silenciosamente ou com erro de modulo nao encontrado.

## Fluxo completo da requisicao

```
Cliente → PATCH /tickets/:id/close
       → Router (tickets.js) identifica a rota
       → Controller (updateStatus.js) recebe request, response, database
       → Atualiza status no banco
       → Retorna resposta
```

O instrutor segue o padrao ja estabelecido no projeto: rota → controller → banco. Consistencia com o que ja existe.