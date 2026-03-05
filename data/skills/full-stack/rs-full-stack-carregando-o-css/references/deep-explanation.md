# Deep Explanation: Carregando CSS com Webpack

## Por que importar CSS via JavaScript?

A abordagem tradicional usa `<link>` tags no HTML para carregar CSS. Com Webpack, o CSS é importado diretamente no JavaScript. Isso traz vantagens:

1. **Webpack gerencia tudo** — resolve dependências, otimiza e empacota automaticamente
2. **Eliminação de código morto** — CSS não importado não vai pro bundle
3. **Consistência** — um único pipeline para todos os assets
4. **Hot Module Replacement** — CSS atualiza sem reload completo durante desenvolvimento

## Os dois loaders e suas responsabilidades

### css-loader
Resolve `@import` e `url()` dentro dos arquivos CSS. Transforma o CSS em módulos JavaScript que o Webpack entende. Sem ele, o Webpack não sabe ler arquivos `.css`.

### style-loader
Pega o CSS processado pelo `css-loader` e injeta no DOM como tags `<style>`. É o que faz o CSS realmente aparecer no browser.

### Ordem de execução (direita para esquerda)

```javascript
use: ["style-loader", "css-loader"]
//     ← executa 2º    ← executa 1º
```

Webpack processa o array `use` de trás pra frente:
1. `css-loader` lê o arquivo `.css`, resolve imports
2. `style-loader` recebe o resultado e injeta no DOM

Se inverter a ordem, o build quebra porque `style-loader` não sabe ler CSS raw.

## Separação de arquivos CSS

O instrutor separa a estilização em arquivos distintos:
- `global.css` — estilos globais (reset, tipografia, cores)
- `form.css` — estilos do formulário
- `schedule.css` — estilos do agendamento

Cada arquivo é importado individualmente no `main.js`. Isso facilita encontrar a estilização de partes específicas do projeto.

## Remoção do index.css agregador

Antes do Webpack, existia um `index.css` que agrupava todas as estilizações (provavelmente via `@import`). Com o Webpack cuidando das importações via JavaScript, esse arquivo agregador se torna desnecessário e pode ser removido.

## Remoção do link no HTML

A tag `<link rel="stylesheet" href="index.css">` no `index.html` também é removida. O Webpack agora é responsável por:
1. Processar os imports de CSS no JavaScript
2. Empacotar tudo no bundle
3. Injetar no DOM via `<style>` tags em runtime

## use strict

O instrutor adiciona `"use strict"` no topo do `main.js` para ativar o modo estrito do JavaScript, que:
- Transforma erros silenciosos em erros explícitos
- Ajuda a manter boas práticas na escrita do código
- Evita problemas futuros com variáveis não declaradas, etc.

## Limitação: assets estáticos

Após configurar o CSS, imagens e ícones ainda não aparecem. Isso acontece porque o Webpack precisa de configuração adicional (file-loader ou asset modules) para copiar a pasta de assets para o diretório `dist`. CSS é texto e pode ser injetado via JavaScript, mas arquivos binários como imagens precisam de tratamento diferente.