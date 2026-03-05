# Deep Explanation: HTTP Status Codes

## Por que status codes importam tanto

O instrutor enfatiza que status codes sao a **comunicacao semantica** entre front-end e back-end. O front-end nao deveria precisar ler o corpo da resposta para saber se deu certo ou errado — o status code ja comunica isso.

### A analogia do "OK vazio"

O instrutor destaca que o 200 e um "OK meio vazio" — ele diz que deu certo, mas nao especifica *o que* deu certo. Por isso existem codigos mais especificos como 201 (Created), que comunica nao apenas sucesso, mas que **algo foi criado como resultado**.

## O anti-pattern classico de empresas grandes

Uma das observacoes mais importantes do instrutor:

> "A pior coisa possivel do mundo e a gente chamar uma API, essa API retornar um status code de sucesso, a gente ficar super feliz com isso, so que no final retornar no corpo da requisicao que houve um erro."

Isso acontece quando o backend sempre retorna 200 e coloca o erro dentro do JSON:
```json
{ "success": false, "error": "User not found" }
```

O front-end que confia no status code (como deveria) vai tratar isso como sucesso. Isso e extremamente comum em APIs legadas de grandes empresas e causa bugs sutis e dificeis de rastrear.

## As 5 faixas de status code

### 1xx — Informativos (100-199)
Raros em APIs REST modernas. Existem mais por questoes de protocolo HTTP.

### 2xx — Sucesso (200-299)
- **200 OK** — padrao, toda requisicao retorna 200 a menos que voce mude
- **201 Created** — "the request succeeded and a new resource was created as a result" — tipicamente usado apos POST ou alguns PUT

### 3xx — Redirecionamento (300-399)
- **301 Moved Permanently** — a rota mudou de endereco permanentemente
- **302 Found** — redirecionamento temporario
- O redirecionamento geralmente e automatico, mas o codigo indica a natureza

### 4xx — Erro do cliente (400-499)
- **400 Bad Request** — informacao enviada de forma errada (email vazio, campo faltando)
- **404 Not Found** — rota ou recurso nao existe
- O erro foi causado pelo **client** (quem fez a requisicao), nao pelo servidor

### 5xx — Erro do servidor (500-599)
- **500 Internal Server Error** — algo deu errado no backend (banco fora do ar, config errada)
- **502 Bad Gateway** — proxy reverso mal configurado
- Sao erros **inesperados** — nao e culpa do front-end

## Contexto mais amplo

O instrutor posiciona os status codes como parte dos **fundamentos de APIs** que transcendem Node.js:
- Requisicao HTTP
- Cabecalhos (headers)
- Metodos HTTP (GET, POST, PUT, DELETE)
- Recursos (URLs)
- Stateful vs Stateless
- Status codes

Ele enfatiza que nao tem como ser um bom profissional de backend sem dominar esses fundamentos, independente da tecnologia.

## Quando usar `writeHead()`

No Node.js puro (sem frameworks), o metodo `res.writeHead(statusCode)` e como voce define o status code antes de enviar a resposta. Em frameworks como Express, seria `res.status(201).send()` ou `res.status(201).json()`.