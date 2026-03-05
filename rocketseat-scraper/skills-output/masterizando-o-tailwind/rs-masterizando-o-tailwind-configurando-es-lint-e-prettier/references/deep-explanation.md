# Deep Explanation: ESLint + Prettier + Tailwind CSS

## Por que integrar Prettier ao ESLint?

O instrutor explica que o `eslint-config-next` padrao do Next.js **nao inclui Prettier**. Isso significa que instalar o `prettier-plugin-tailwindcss` sozinho nao funciona via ESLint — e necessario que o ESLint tenha o Prettier integrado como plugin.

A solucao e usar uma configuracao ESLint que ja embute o Prettier (como `@rocketseat/eslint-config`), ou instalar manualmente `eslint-plugin-prettier` e `eslint-config-prettier`.

## Cadeia de dependencias

```
eslint-config-next (padrao Next.js)
  └── NAO tem Prettier

@rocketseat/eslint-config/next
  ├── plugin:prettier/recommended
  ├── regras do Prettier
  └── permite plugins do Prettier funcionarem
        └── prettier-plugin-tailwindcss
              └── reordena classes automaticamente
```

## Por que ordenar classes Tailwind?

O instrutor descreve a ordenacao manual como "uma tarefa bem chatinha". Sem o plugin, cada dev ordena classes de forma diferente, dificultando reviews e gerando diffs desnecessarios.

A ordem semantica imposta pelo plugin segue a logica do proprio Tailwind:
1. **Estruturais** — layout e spacing (o "esqueleto")
2. **Visuais** — cores, fontes, bordas (a "aparencia")
3. **Interativos** — seletores como `hover:`, `dark:`, `focus:` (os "estados")

## VSCode nao observa prettier.config.js

Detalhe importante mencionado pelo instrutor: o VSCode le o `prettier.config.js` apenas uma vez ao abrir o projeto. Qualquer alteracao nesse arquivo requer `Developer: Reload Window`. Isso e uma fonte comum de confusao — o dev instala tudo certo mas nada funciona ate dar reload.

## Configuracao ESLint fix on save

Para a correcao automatica funcionar ao salvar, e necessario ter no `settings.json` do VSCode:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Debugging

O instrutor recomenda verificar a aba **Output > ESLint** no VSCode quando algo nao funciona. Conflitos entre plugins sao a causa mais comum de falhas silenciosas.