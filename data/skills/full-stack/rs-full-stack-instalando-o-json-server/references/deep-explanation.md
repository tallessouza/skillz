# Deep Explanation: JSON Server — Setup de API Local

## Por que usar json-server?

O instrutor Rodrigo explica três motivações claras:

1. **Independência de internet** — não depender de conexão para estudar/desenvolver
2. **Independência de APIs públicas** — APIs gratuitas podem sair do ar, mudar, ou ter rate limiting
3. **Foco no consumo, não na criação** — nesse momento da jornada, o objetivo é aprender a usar `fetch` no JavaScript, não construir um backend

A ideia central: **json-server remove a complexidade do backend para que o aluno foque 100% no frontend e no consumo de APIs.**

## Como funciona a relação arquivo JSON → endpoints

O json-server lê o arquivo JSON e transforma cada chave do objeto raiz em um endpoint REST completo:

```json
{
  "teste": [{ "name": "Rodrigo Gonçalves" }]
}
```

Isso gera automaticamente:
- `GET /teste` → retorna o array
- `GET /teste/1` → retorna item por id
- `POST /teste` → cria novo item
- `PUT /teste/1` → atualiza item
- `DELETE /teste/1` → remove item

O instrutor demonstra isso acessando `localhost:3000/teste` no navegador e vendo o retorno imediato.

## Anatomia da URL local

O instrutor explica o padrão da URL:

```
http://localhost:3333/teste
 │       │        │     │
 │       │        │     └── recurso (chave do JSON)
 │       │        └── porta onde a API roda
 │       └── aponta para a própria máquina
 └── protocolo
```

**localhost** = "a API está rodando aqui no meu computador"
**:3333** = número da porta onde o json-server está escutando
**/teste** = nome do recurso, correspondente à chave no `server.json`

## Mudança de porta

Por padrão, json-server usa porta 3000. O instrutor mostra como mudar:

```json
"server": "json-server server.json --port 3333"
```

A flag `--port` (com dois traços) permite configurar qualquer porta. O instrutor menciona que 3333 é uma convenção comum para APIs locais, mas qualquer porta livre funciona.

**Detalhe importante:** após mudar a porta, é preciso atualizar a URL no navegador. O instrutor demonstra o erro de tentar acessar a porta antiga (3000) após reconfigurar para 3333.

## Ctrl+C para interromper

O instrutor enfatiza: para parar o json-server, usar `Ctrl+C` no terminal. Enquanto o servidor estiver rodando, o terminal fica "preso" naquele processo.

## Transferibilidade do conhecimento

O instrutor faz questão de destacar: **tudo que se aprende consumindo o json-server se aplica a qualquer API real.** O formato de requisição, uso do fetch, tratamento de resposta — tudo é idêntico. O json-server é apenas uma conveniência para o aprendizado, não uma ferramenta limitada.

## Contexto do projeto

O instrutor mostra a estrutura base:
- Um arquivo HTML simples que carrega um `main.js`
- O `main.js` está vazio (será preenchido nas próximas aulas)
- É a mesma estrutura que o curso vem usando

O json-server é adicionado a essa estrutura existente, não requer reorganização do projeto.