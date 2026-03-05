# Code Examples: Usando o json-server

## Instalacao

```bash
# Versao fixa (recomendado para acompanhar o curso)
npm install json-server@0.17.4

# Ultima versao (cuidado com breaking changes)
npm install json-server
```

## package.json completo

```json
{
  "scripts": {
    "server": "json-server --watch server.json --port 3333"
  },
  "dependencies": {
    "json-server": "0.17.4"
  }
}
```

## server.json — Vazio (inicio do projeto)

```json
{
  "schedules": []
}
```

## server.json — Com dados de teste

```json
{
  "schedules": [
    {
      "id": 7
    }
  ]
}
```

O instrutor adicionou temporariamente um objeto com `id: 7` para demonstrar que o json-server serve os dados dinamicamente. Ao salvar o arquivo e recarregar o navegador, os novos dados aparecem imediatamente gracas ao `--watch`.

## server.json — Multiplas rotas

```json
{
  "schedules": [],
  "users": [],
  "services": []
}
```

Cada chave gera endpoints REST completos automaticamente.

## .gitignore

```
node_modules
```

## Verificacao no navegador

```
http://localhost:3333/schedules
```

Retorna `[]` quando o array esta vazio, ou os objetos adicionados.

## Variacao: Porta diferente

```json
{
  "scripts": {
    "server": "json-server --watch server.json --port 4000"
  }
}
```

## Variacao: Arquivo de dados em subpasta

```json
{
  "scripts": {
    "server": "json-server --watch data/db.json --port 3333"
  }
}
```

## Regenerando node_modules

```bash
# Se deletou node_modules ou clonou o projeto
npm install
# ou abreviado
npm i
```