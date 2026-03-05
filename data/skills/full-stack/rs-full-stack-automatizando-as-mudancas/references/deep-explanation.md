# Deep Explanation: Automatizando Build com Babel Watch

## Por que watch mode existe

O fluxo padrao com Babel e: edita codigo fonte → executa `npm run build` → Babel transpila → browser carrega o resultado de `dist/`. Sem watch, cada alteracao exige reexecucao manual do build. Isso quebra o flow de desenvolvimento.

O instrutor demonstra isso na pratica: alterou `main.js`, nada mudou no browser. O `dist/` ainda continha a versao anterior. So apos executar `npm run build` manualmente o resultado atualizou.

## Como o watch funciona internamente

A flag `--watch` faz o processo do Babel **nao encerrar** apos a compilacao. Ele usa file system watchers (via `chokidar` ou APIs nativas do OS) para detectar mudancas nos arquivos de entrada. Quando detecta uma alteracao:

1. Recompila o(s) arquivo(s) alterados
2. Sobrescreve o output em `dist/`
3. Volta a observar

O terminal mostra `The watcher is ready` quando entra nesse modo. A cada recompilacao, mostra a mensagem de sucesso.

## Fluxo mental do instrutor

1. **Problema:** preciso executar `npm run build` toda vez que mudo algo
2. **Solucao:** adicionar `--watch` ao script existente
3. **Resultado:** salvar o arquivo aciona recompilacao automatica
4. **Encerramento:** `Ctrl+C` mata o processo quando quiser parar

## Atalhos de terminal mencionados

| Atalho | Funcao |
|--------|--------|
| `Ctrl+C` | Encerra o processo em execucao (mata o watcher) |
| `Ctrl+L` | Limpa a tela do terminal |
| `Ctrl+U` | Limpa a linha atual |
| `cls` / `clear` | Limpa terminal (Windows / Unix) |

## Ponto importante: o terminal fica "preso"

Enquanto o watcher esta ativo, o terminal nao aceita novos comandos. Isso e esperado — o processo esta em execucao continua. Para executar outros comandos, abra outro terminal ou encerre o watcher com `Ctrl+C`.

## Quando NAO usar watch

- Em pipelines de CI/CD: o build deve ser one-shot (sem `--watch`)
- Em producao: nao faz sentido observar mudancas
- Quando usando bundlers como Webpack/Vite que ja tem seu proprio watch mode