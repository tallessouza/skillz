# Deep Explanation: Jest Watch Mode

## Por que automatizar a execucao de testes?

O instrutor demonstra o problema de forma pratica: toda vez que modifica um arquivo de teste, precisa:
1. Limpar o terminal
2. Digitar `npm test`
3. Dar enter
4. Esperar a execucao
5. Repetir tudo de novo na proxima mudanca

Esse ciclo manual e improdutivo e quebra o fluxo de desenvolvimento. A solucao e usar a flag `--watchAll` do Jest, que transforma o processo em: salvar o arquivo → testes re-executam automaticamente.

## `--watch` vs `--watchAll`

- **`--watch`**: Observa apenas arquivos modificados de acordo com o git status. Requer que o projeto esteja em um repositorio git. Mais eficiente em projetos grandes porque so re-executa testes relacionados aos arquivos alterados.
- **`--watchAll`**: Observa TODOS os arquivos de teste, independente do git. Funciona mesmo sem repositorio git inicializado. E a flag recomendada pelo instrutor e a que aparece como sugestao do proprio Jest quando `--watch` nao funciona (projeto sem git).

O instrutor inicialmente tentou `--watch` e o Jest sugeriu usar `--watchAll`, entao ele corrigiu para `--watchAll`.

## Separacao de scripts: design deliberado

O instrutor faz questao de separar em dois scripts:

```json
{
  "test": "jest",
  "test:dev": "jest --watchAll"
}
```

A razao e pratica:
- `npm test` (ou `npm run test`) executa os testes uma vez e termina. Util para CI, pre-commit hooks, ou verificacao rapida.
- `npm run test:dev` inicia o modo watch interativo. Util durante o desenvolvimento ativo.

Note que `npm test` funciona sem `run` (e um dos scripts especiais do npm), mas `npm run test:dev` precisa do `run` porque `test:dev` nao e um alias especial.

## Menu interativo do watch mode

Quando o Jest esta em watch mode, ele exibe opcoes interativas:
- **`f`** — Rodar apenas testes que falharam
- **`a`** — Rodar todos os testes
- **`p`** — Filtrar por nome de arquivo (regex)
- **`t`** — Filtrar por nome de teste (regex)
- **`q`** — Sair do watch mode
- **Enter** — Re-executar todos os testes

Essas opcoes permitem foco durante debugging sem precisar modificar codigo ou configuracao.

## Fluxo demonstrado na aula

1. Teste passando com valor `10` → testes verdes
2. Muda para `12` e salva → Jest detecta mudanca → re-executa → teste falha (vermelho)
3. Volta para `10` e salva → Jest detecta → re-executa → teste passa (verde)

Tudo sem tocar no terminal. O feedback e imediato.