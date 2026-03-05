# Deep Explanation: Hook de Compartilhamento Social

## Por que arrow function no share?

O instrutor explica que define `share` como `const share = ...` (arrow function) em vez de `function share()` porque precisa envolver em `useCallback` depois. Arrow functions sao expressoes que podem ser passadas diretamente para hooks de memoizacao, enquanto function declarations precisariam ser refatoradas.

## Por que nao usar useRouter do Next.js?

O `useRouter` serve para navegar o usuario DENTRO da aplicacao Next.js. Links de compartilhamento social sao URLs externas — precisam abrir em nova aba com `window.open`. Usar router para isso quebraria a navegacao e nao abriria nova aba.

## Cadeia de memoizacao

A ordem importa:
1. `shareConfig` em `useMemo` — porque e um objeto que seria recriado a cada render
2. `share` em `useCallback` dependendo de `shareConfig` — so recria se config mudar
3. `shareButtons` em `useMemo` dependendo de `share` — so recria se share mudar

Se `shareConfig` nao fosse memoizado, ele seria uma referencia nova a cada render, invalidando o `useCallback` do `share`, que invalidaria o `useMemo` dos `shareButtons` — cascata de re-renders.

## Escalabilidade do pattern

O instrutor demonstra adicionando Threads ao vivo: basta adicionar uma entrada no objeto `socialProviders`, atualizar o type union, e os botoes aparecem automaticamente. Zero mudanca no componente consumidor. Isso e o poder do pattern config-driven.

## window.open parametros

```
window.open(url, '_blank', 'width=600,height=600,location=yes,status=yes')
```
- `_blank`: nova aba/janela
- `width/height=600`: popup dimensionada para formularios de share
- `location=yes`: mostra barra de endereco (seguranca)
- `status=yes`: mostra barra de status

## Try/catch com return boolean

O share retorna `true` (sucesso) ou `false` (erro). Isso permite que o componente consumidor reaja: mostrar toast de sucesso, feedback visual, etc. O `!!shareWindow` converte o objeto window (ou null se bloqueado por popup blocker) em boolean.

## Validacao de provider

```typescript
if (!providerConfig) {
  throw new Error(`Provider nao suportado: ${provider}`)
}
```

Mesmo com TypeScript, o instrutor adiciona validacao runtime porque o type system nao cobre dados dinamicos em runtime. Se alguem passar um provider invalido, o erro e explicito em vez de um `undefined.shareURL is not a function`.