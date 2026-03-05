# Deep Explanation: Criar Projeto Node.js + TypeScript

## Por que tsx e nao tsc + node?

O instrutor escolhe `tsx` em vez do fluxo tradicional `tsc` (compilar) + `node` (executar) por uma razao pratica: o foco da aula e **testes**, nao configuracao de build. O tsx combina compilacao e execucao em um unico comando, eliminando:

- `tsconfig.json` (nao necessario para desenvolvimento)
- Pasta `dist/` com arquivos compilados
- Dois passos separados (compilar, depois executar)

Isso permite que o aluno comece a escrever codigo TypeScript imediatamente sem fricao de setup.

## tsx watch vs nodemon

O `tsx watch` substitui o padrao antigo de `nodemon + ts-node`:

| Aspecto | nodemon + ts-node | tsx watch |
|---------|-------------------|-----------|
| Instalacao | 2 pacotes | 1 pacote |
| Configuracao | nodemon.json opcional | Nenhuma |
| Performance | Recompila tudo | Usa esbuild (rapido) |
| Comando | `nodemon --exec ts-node src/server.ts` | `tsx watch src/server.ts` |

## Estrutura minimalista intencional

O instrutor remove deliberadamente `keywords`, `author` e `description` do package.json. Isso nao e desleixo — e foco. Para um projeto de aprendizado/testes, metadados de publicacao sao ruido.

O principio: **inclua apenas o que o projeto precisa agora**. Se nunca vai publicar no npm, nao precisa de metadados de publicacao.

## Versao fixa do tsx (4.19.1)

O instrutor fixa a versao com `tsx@4.19.1` em vez de usar `tsx@latest`. Isso garante que todos os alunos tenham o mesmo comportamento, evitando bugs causados por breaking changes em versoes futuras.

## Pasta src/ como convencao

Separar codigo-fonte em `src/` e uma convencao que:
1. Facilita configurar `tsconfig.json` no futuro (rootDir: "./src")
2. Separa codigo de configuracao (package.json, tsconfig, etc.)
3. Permite adicionar `tests/` ou `__tests__/` no mesmo nivel

## Hot-reload como ferramenta de aprendizado

O `tsx watch` nao e apenas conveniencia — e uma ferramenta pedagogica. O aluno ve o resultado imediatamente apos salvar, criando um loop de feedback rapido que acelera o aprendizado. O instrutor demonstra isso ao trocar "Hello World" por "Rodrigo" e ver a saida atualizar instantaneamente.