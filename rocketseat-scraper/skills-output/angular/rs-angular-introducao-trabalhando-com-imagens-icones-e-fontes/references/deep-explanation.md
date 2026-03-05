# Deep Explanation: Assets no Angular — Imagens, Ícones e Fontes

## O que são Assets?

O instrutor define assets como "arquivos brutos que não vão ser alterados" — ou seja, arquivos estáticos que o Angular serve diretamente sem processamento pelo compilador. Isso inclui:

- **Imagens** (PNG, JPG, SVG, WebP)
- **Ícones** (SVGs avulsos, bibliotecas como FontAwesome)
- **Fontes** (custom fonts da empresa, Google Fonts)

A distinção importante é que esses arquivos não passam pelo pipeline de compilação TypeScript/Angular — eles são copiados diretamente para o build output.

## Por que isso importa?

O instrutor enfatiza que "a nossa aplicação Angular tem que ficar bonita" — assets são fundamentais para a experiência visual. Sem o gerenciamento correto:

- Imagens não carregam em produção (paths errados)
- Fontes customizadas não aparecem (falta `@font-face`)
- Ícones quebram quando o CDN cai (sem fallback)

## Duas abordagens para ícones FontAwesome

O instrutor destaca explicitamente que existem **duas formas** de importar FontAwesome:

1. **Via CDN** — mais rápido para prototipar, dependência externa
2. **Via npm** — controle total de versão, funciona offline, melhor para produção

Essa dualidade CDN vs npm é um padrão recorrente em qualquer biblioteca de assets no frontend.

## Fontes customizadas vs Google Fonts

O instrutor faz a distinção entre:

- **Fontes próprias da empresa** — precisam ser importadas manualmente no projeto, declaradas via `@font-face`, e referenciadas no CSS
- **Google Fonts** — podem ser importadas via `<link>` no HTML ou `@import` no CSS, sem necessidade de hospedar o arquivo

Ambas precisam ser referenciadas corretamente no CSS dos componentes para funcionarem.

## Contexto da sessão

Esta é uma aula introdutória que apresenta os tópicos que serão detalhados nas próximas aulas. O instrutor está preparando o terreno para:

1. Trabalhar com imagens (importar, referenciar no componente)
2. Trabalhar com SVGs (inline, como componente)
3. FontAwesome via CDN e npm
4. Fontes customizadas (próprias)
5. Google Fonts