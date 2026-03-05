# Deep Explanation: Truncar Texto com Slice Pipe

## O problema

Quando o usuario insere textos longos (tanto no nome quanto na descricao de uma tarefa), o layout do card quebra. Isso acontece porque o texto ultrapassa os limites visuais do componente, empurrando outros elementos ou causando overflow.

## Por que slice pipe e nao substring?

O Angular fornece o `SlicePipe` como parte do `@angular/common`. Ele funciona como o `Array.prototype.slice()` / `String.prototype.slice()` do JavaScript, mas no formato de pipe para uso em templates. A vantagem e manter a logica de apresentacao no template (onde ela pertence para casos simples) sem poluir o componente TypeScript.

## A logica do ternario

O instrutor optou por um ternario inline ao inves de um pipe personalizado porque a logica e simples:

1. Verifica se o texto e menor que o limite
2. Se sim, mostra o texto original (sem reticencias desnecessarias)
3. Se nao, aplica o slice e concatena `'...'`

Ele mencionou explicitamente que "poderia criar um pipe personalizado, mas como a logica e bem simples, vou criar no template mesmo". Isso e um bom julgamento — pipes personalizados adicionam complexidade (arquivo, teste, import) que so se justifica quando a logica e reutilizada ou complexa.

## Ajuste iterativo dos limites

O instrutor comecou com limite de 20 caracteres para o nome, testou, percebeu que ainda quebrava o layout do titulo (que tem fonte maior e menos espaco), e reduziu para 13. Isso demonstra que o limite ideal depende do contexto visual — nao existe um numero magico universal.

## O atributo title como solucao de UX

Apos truncar o texto, o usuario perde acesso a informacao completa. A solucao foi usar property binding `[title]="task.name"` no elemento `<p>`, que cria um tooltip nativo do navegador ao passar o mouse. E uma solucao simples e acessivel, sem necessidade de bibliotecas de tooltip.

## Quando migrar para um custom pipe

Se voce precisar dessa logica de truncamento em mais de 2-3 templates diferentes, vale criar um `TruncatePipe` personalizado:

```typescript
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20): string {
    return value.length < limit ? value : value.slice(0, limit) + '...';
  }
}
```

Mas para uso em um unico componente, o ternario inline e perfeitamente adequado.