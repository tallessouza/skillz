# Deep Explanation: Setup do Projeto Base — Query Builder

## Por que o projeto e entregue pronto

O instrutor (Rodrigo) explica a decisao pedagogica: o foco do modulo e **Query Builder**, nao a criacao de uma API Express do zero. Criar a API desde o inicio consumiria tempo sem ensinar nada novo — o aluno ja conhece Express e TypeScript de modulos anteriores.

A estrategia e: entregar o minimo viavel (uma rota GET `/` com "hello world") e ir direto ao conteudo novo.

## Estrutura minimalista proposital

O projeto tem apenas **um arquivo de codigo** (`src/server.ts`). Isso e intencional:

- Reduz distracao — o aluno foca no que vai ser adicionado, nao no que ja existe
- Facilita navegacao — tudo esta em um lugar
- Demonstra o padrao Express minimo: import → app → middleware → rota → listen

## Ferramentas utilizadas

### Express com JSON middleware

```typescript
app.use(express.json())
```

Habilitado desde o inicio porque o Query Builder vai trabalhar com requisicoes que enviam JSON no body (POST, PUT).

### Insomnia como cliente HTTP

O instrutor escolhe Insomnia ao inves do navegador porque:
- Permite testar todos os metodos HTTP (GET, POST, PUT, DELETE)
- Facilita enviar headers e body
- Organiza requisicoes em colecoes
- O navegador so faz GET facilmente

A colecao "query builder" no Insomnia servira como workspace para todas as requisicoes do modulo.

### TypeScript configurado

O `tsconfig.json` ja vem pronto. O `npm run dev` provavelmente usa `tsx` ou `ts-node-dev` para hot reload — quando o instrutor muda "hello world" para "hello", o servidor recarrega automaticamente.

## Fluxo esperado do aluno

1. Download do template
2. `npm install` (gerar node_modules)
3. `npm run dev` (iniciar servidor)
4. Configurar Insomnia com a colecao
5. Verificar que GET `/` funciona
6. Estar pronto para as proximas aulas onde o Query Builder sera implementado