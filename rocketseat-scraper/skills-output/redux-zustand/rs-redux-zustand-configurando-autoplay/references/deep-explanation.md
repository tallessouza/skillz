# Deep Explanation: Configurando Autoplay

## Por que o next nao precisa de payload

O instrutor destaca um insight importante: diferente da action `play` que precisa saber QUAL aula tocar (recebendo moduleIndex e lessonIndex como payload), a action `next` ja tem toda a informacao necessaria no state. O currentModuleIndex e currentLessonIndex ja estao la — basta calcular o proximo.

Isso exemplifica um principio do Redux: **actions devem carregar apenas dados que o reducer nao consegue derivar do estado atual**. Se o reducer consegue calcular, nao mande no payload.

## Logica de fronteira em detalhe

A navegacao sequencial tem 3 cenarios:

1. **Caso feliz** — existe proxima lesson no modulo atual. Simplesmente incrementa o indice.
2. **Fronteira de modulo** — ultima lesson do modulo atual. Precisa pular para o proximo modulo E resetar o indice da lesson para 0 (primeira aula do novo modulo).
3. **Fim do curso** — ultima lesson do ultimo modulo. Nao faz nada. O video simplesmente para.

O instrutor usa a tecnica de verificar se o item existe no array (`state.course.modules[nextModuleIndex]`) — se o indice estiver fora do array, retorna `undefined`, que e falsy. Elegante e conciso.

## Sobre o else vs early return

O instrutor menciona que algumas pessoas preferem usar `return` ao inves de `else`:

```typescript
if (nextLesson) {
  state.currentLessonIndex = nextLessonIndex
  return
}
// codigo do else aqui
```

Ele diz que nesse caso especifico nao ve problema com `else` porque sao apenas dois cenarios mutuamente exclusivos. E uma questao de estilo pessoal.

## PayloadAction e TypeScript

O instrutor mostra que sem tipagem, ao tentar passar payload vazio para `next()`, o TypeScript reclama porque nao sabe o que a action espera. Ao tipar com `PayloadAction<[number, number]>` na action `play`, o TypeScript entende que `play` precisa de um array de dois numeros. E ao simplesmente omitir o tipo na action `next` (usando apenas `state`), o TypeScript infere que nao ha payload.

A tupla `[number, number]` representa `[moduleIndex, lessonIndex]`.

## ReactPlayer: onEnded e playing

O ReactPlayer expoe varios eventos (`onPlay`, `onPause`, `onEnded`, etc.). O `onEnded` dispara quando o video chega ao fim — perfeito para o autoplay.

A prop `playing={true}` faz o video iniciar automaticamente. Sem ela, a navegacao funciona (o video correto e carregado), mas o usuario precisa clicar play manualmente.

## defaultOpen no Collapsible

No final, o instrutor adiciona `defaultOpen={moduleIndex === 0}` ao componente Collapsible do modulo. Isso faz o primeiro modulo ja vir expandido ao carregar a pagina — melhora a UX mostrando o conteudo imediatamente.