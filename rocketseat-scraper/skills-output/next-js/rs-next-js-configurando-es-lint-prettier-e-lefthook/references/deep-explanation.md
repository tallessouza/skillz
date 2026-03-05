# Deep Explanation: ESLint, Prettier e Lefthook

## Tres ferramentas, tres responsabilidades

O instrutor faz uma distincao clara entre as tres ferramentas:

1. **Prettier** — "formatador de codigo opinativo". Cuida exclusivamente da aparencia: aspas, tabs, largura de linha, ponto-e-virgula. Nao entende logica, apenas estilo visual.

2. **ESLint** — "professor particular de gramatica e boas praticas". Vai alem da aparencia — analisa o que foi escrito, aponta possiveis erros, sugere melhorias e garante que as melhores praticas da linguagem estao sendo seguidas.

3. **Lefthook** — "porteiro automatico do repositorio". Gerencia GitHooks para barrar codigo problematico antes que chegue ao repositorio. Funciona como uma barreira de qualidade automatica.

## Por que Lefthook e nao Husky?

O instrutor menciona que conhece o Husky mas ultimamente tem preferido o Lefthook. As razoes implicitas:
- Configuracao mais simples (arquivo YAML declarativo)
- Nao precisa de scripts shell em `.husky/`
- Suporta multiplos comandos por hook nativamente
- Configuracao vive em um unico arquivo `lefthook.yml`

## GitHooks como porteiros

A analogia do instrutor: GitHooks sao "porteiros automaticos". Antes de cada commit ou push, o porteiro barra a entrada e faz checagens. Se algo estiver errado, a operacao e rejeitada.

### Pre-commit vs Pre-push

A estrategia e intencional:
- **Pre-commit** roda checks rapidos (formatting) — executado frequentemente, precisa ser veloz
- **Pre-push** roda checks pesados (typecheck, testes) — executado menos frequentemente, pode demorar mais

Essa separacao evita que o dev espere typecheck a cada commit, mas garante que codigo com erros de tipo nunca chegue ao repositorio remoto.

## O papel do `.vscode/settings.json`

O instrutor enfatiza: "cada dev do seu time tem configuracoes diferentes por default, mas isso aqui vai ser o padrao de todo mundo que estiver trabalhando com esse projeto."

Ao commitar `.vscode/settings.json` no repositorio, voce garante que:
- `formatOnSave` esta ativo para todos
- ESLint roda automaticamente ao salvar
- Prettier e o formatador padrao
- Nenhum dev precisa configurar nada manualmente

## Fluxo de protecao completo

```
Dev escreve codigo
    |
    v
Salva arquivo (Cmd+S)
    |
    v
VS Code roda ESLint + Prettier automaticamente (settings.json)
    |
    v
Dev faz git commit
    |
    v
Lefthook pre-commit → roda `pnpm format` (prettier --check)
    |
    ├── FALHOU → commit rejeitado, dev corrige formatacao
    |
    └── PASSOU → commit aceito
         |
         v
    Dev faz git push
         |
         v
    Lefthook pre-push → roda `pnpm validate:typecheck` (tsc --noEmit)
         |
         ├── FALHOU → push rejeitado, dev corrige tipos
         |
         └── PASSOU → codigo vai pro repositorio
```

## Detalhe importante: `pnpx lefthook install`

O instrutor demonstra ao vivo que sem rodar `pnpx lefthook install`, os hooks nao funcionam. Ele tenta um push, espera que quebre, e nao quebra — porque esqueceu de instalar. Esse e um erro comum que todo dev vai cometer pelo menos uma vez.

A solucao e adicionar no `prepare` script do package.json:

```json
{
  "scripts": {
    "prepare": "lefthook install"
  }
}
```

Assim, todo `pnpm install` automaticamente registra os hooks.

## Por que eslint-config-prettier existe

Prettier e ESLint podem ter regras conflitantes (ex: ESLint quer aspas duplas, Prettier quer aspas simples). O pacote `eslint-config-prettier` desativa todas as regras do ESLint que conflitam com Prettier, deixando cada ferramenta cuidar do que faz melhor.