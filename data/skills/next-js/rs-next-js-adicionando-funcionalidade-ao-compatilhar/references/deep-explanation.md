# Deep Explanation: useClipboard Hook Pattern

## Por que um custom hook separado?

O instrutor enfatiza a importancia de encapsular a logica de copia em um hook dedicado porque:

1. **Reutilizabilidade** — a mesma logica de copiar pode ser usada em qualquer componente da aplicacao (share buttons, code blocks, links)
2. **Separacao de responsabilidades** — o componente nao precisa saber COMO copiar, so precisa do estado e da funcao
3. **Organizacao em pasta** — o hook fica em `hooks/useClipboard/index.ts`, seguindo o padrao de pasta por feature

## O padrao de feedback temporario

O instrutor referencia a documentacao do Next.js como exemplo: quando voce clica em "copiar", o icone e texto mudam temporariamente e depois retornam ao estado default. Esse padrao e extremamente comum em documentacoes e blogs.

A implementacao usa tres pecas:
- `isCopied` (useState) — controla o estado visual
- `handleCopy` (useCallback) — executa a copia e seta `true`
- `useEffect` com `setTimeout` — reseta para `false` apos o timeout

## Por que useCallback?

Como `handleCopy` sera exportado do hook e potencialmente usado como dependencia em outros hooks ou passado como prop, `useCallback` garante estabilidade referencial — a funcao so e recriada quando suas dependencias mudam.

## Cleanup do timer

O `clearTimeout` no return do `useEffect` e essencial. Se o componente desmontar antes do timeout completar (ex: usuario navega para outra pagina), o cleanup evita:
- Memory leaks
- Tentativa de atualizar estado em componente desmontado (warning do React)

## Integracao com social providers

O instrutor mostra como integrar o clipboard como mais um "provider" no sistema de compartilhamento. Ao adicionar `clipboard` ao tipo `SocialProvider`, o mesmo componente de share buttons pode lidar com redes sociais E copia de link de forma uniforme:

```typescript
if (provider === 'clipboard') {
  return await handleCopy(url)
}
```

Isso evita logica condicional espalhada e mantem o padrao de provider consistente.

## O timeout default de 2 segundos

O instrutor define 2000ms como default tanto no `useClipboard` quanto no `useShare` que o consome. Esse valor e um padrao de UX amplamente aceito — tempo suficiente para o usuario perceber o feedback sem ser intrusivo.