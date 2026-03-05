# Deep Explanation: Usando o json-server

## Por que usar json-server?

O json-server permite que o frontend seja desenvolvido sem depender de uma API externa. Ele transforma um simples arquivo JSON em uma REST API completa com todos os verbos HTTP, sem precisar escrever uma unica linha de codigo backend.

Isso resolve um problema classico: o frontend fica bloqueado esperando o backend ficar pronto. Com json-server, o desenvolvimento frontend acontece em paralelo.

## Como o json-server funciona internamente

Cada chave no arquivo JSON vira um recurso REST:

```json
{
  "schedules": [],
  "users": []
}
```

Gera automaticamente:
- `GET /schedules` — lista todos
- `GET /schedules/:id` — busca por ID
- `POST /schedules` — cria novo (gera ID automatico)
- `PUT /schedules/:id` — atualiza completo
- `PATCH /schedules/:id` — atualiza parcial
- `DELETE /schedules/:id` — remove

O `--watch` usa file watchers do sistema operacional para detectar mudancas no arquivo e reiniciar o servidor automaticamente.

## Por que fixar a versao?

O instrutor enfatiza instalar a mesma versao (`@0.17.4`) porque:
- json-server teve breaking changes significativas entre versoes major
- A versao 1.x mudou completamente a API de configuracao
- Fixar garante que o ambiente do aluno reproduz exatamente o do instrutor

Padrao geral: em cursos e tutoriais, sempre fixar versoes para reproducibilidade.

## O problema do "too many open files"

O erro de "too many open files" acontece quando o sistema operacional atinge o limite de file descriptors abertos. No VS Code isso pode ocorrer porque:
- O `--watch` do json-server abre watchers
- O VS Code ja tem seus proprios watchers
- Combinados, podem exceder o limite do OS

Solucao simples: recarregar o VS Code (`Cmd+Shift+P` → "Reload Window"). Isso libera os file descriptors antigos.

## Fluxo de desenvolvimento recomendado

O instrutor recomenda manter SEMPRE o servidor rodando durante o desenvolvimento. A logica:
- A aplicacao frontend faz requisicoes HTTP para `localhost:3333`
- Se o servidor nao estiver rodando, TODAS as requisicoes falham
- Manter dois terminais separados (server + web) evita ter que ficar parando/iniciando

A dica de renomear terminais no VS Code e pratica — em projetos reais voce pode ter 3-4 terminais (server, web, testes, logs) e os nomes ajudam a navegar.

## .gitignore e node_modules

O instrutor explica que `node_modules` nao deve ir para o GitHub porque:
- E pesada (pode ter centenas de MB)
- E regeneravel com `npm install` a qualquer momento
- O `package.json` + `package-lock.json` sao suficientes para reproduzir

Esse e um fundamento basico de Node.js que todo desenvolvedor precisa internalizar.