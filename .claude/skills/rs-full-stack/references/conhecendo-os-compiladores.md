---
name: rs-full-stack-conhecendo-os-compiladores
description: "Applies JavaScript compiler and transpilation concepts when discussing build tools, Babel, SWC, or browser compatibility. Use when user asks to 'setup a build pipeline', 'support older browsers', 'configure Babel', 'transpile code', or 'explain how bundlers work'. Covers parser-transformer-generator pipeline and why transpilation enables modern JS usage. Make sure to use this skill whenever build tooling or browser compatibility is discussed. Not for runtime debugging, CSS preprocessing, or TypeScript type-checking specifics."
---

# Compiladores e Transpilacao em JavaScript

> Compiladores convertem codigo JavaScript moderno para versoes anteriores, garantindo compatibilidade com navegadores antigos sem sacrificar o uso de recursos recentes da linguagem.

## Key concept

O compilador JavaScript pega codigo escrito com funcionalidades modernas (ES2020+) e converte para versoes anteriores do ECMAScript que navegadores antigos conseguem executar. Isso permite escrever com sintaxe moderna enquanto mantém compatibilidade ampla.

**Transpilacao** e o termo especifico para compilacao entre versoes da mesma linguagem (JS moderno → JS antigo), diferente de compilacao tradicional (linguagem de alto nivel → codigo de maquina).

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Projeto precisa suportar navegadores antigos | Configure um compilador (Babel, SWC) no build pipeline |
| Feature moderna do JS nao funciona em ambiente alvo | Transpilacao resolve — nao reescreva manualmente |
| Duvida se pode usar sintaxe nova | Use — o compilador cuida da compatibilidade |
| Multiplas bibliotecas em versoes diferentes do ES | Transpilacao unifica para uma versao alvo comum |

## How to think about it

### O pipeline de 3 etapas

Todo compilador/transpilador JavaScript segue este fluxo:

1. **Parser** — Mapeia todos os elementos do codigo fonte, gerando uma AST (Abstract Syntax Tree)
2. **Transformer** — Manipula os elementos da AST para produzir equivalentes compativeis com a versao alvo
3. **Generator** — Gera o codigo final compativel a partir da AST transformada

```
Codigo Moderno → [Parser → AST] → [Transformer → AST modificada] → [Generator → Codigo Compativel]
```

### Por que nao fazer manualmente?

Uma arrow function simples como `const sum = (x, y) => x + y` gera saidas diferentes para ES2015 vs ES2016. Multiplicar isso por cada feature moderna em cada arquivo do projeto torna impossivel manter manualmente. O compilador automatiza todas as conversoes simultaneamente.

### Impacto na evolucao da linguagem

Compiladores permitem que a comunidade adote features novas do ECMAScript imediatamente, mesmo antes de suporte universal nos navegadores. Isso acelera a evolucao da linguagem porque desenvolvedores usam e validam propostas novas na pratica.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Compilador JS traduz para outra linguagem | Transpila JS moderno → JS antigo (mesma linguagem) |
| Precisa escolher entre sintaxe moderna ou compatibilidade | Compilador permite ter os dois |
| Transpilacao e so sobre arrow functions | Cobre destructuring, optional chaining, nullish coalescing, async/await, e toda feature moderna |
| Configurar compilador e opcional em projetos modernos | Frameworks como Next, Vite, e Create React App ja incluem transpilacao no build |

## When to apply

- Ao configurar build pipeline de qualquer projeto frontend
- Ao escolher entre Babel, SWC, ou esbuild
- Ao definir o `target` no tsconfig ou na configuracao do bundler
- Ao decidir quais features do JS sao seguras para usar no projeto
- Ao debugar problemas de compatibilidade entre navegadores

## Limitations

- Transpilacao nao resolve APIs ausentes (ex: `fetch`, `Promise`) — para isso precisa de **polyfills**
- O codigo gerado pode ser mais verboso e ligeiramente mais lento que o original
- Nem toda feature moderna tem equivalente perfeito em versoes antigas

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre parser/transformer/generator, analogias e motivacao historica
- [code-examples.md](references/code-examples.md) — Exemplos de transpilacao entre versoes do ECMAScript

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conhecendo-os-compiladores/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conhecendo-os-compiladores/references/code-examples.md)
