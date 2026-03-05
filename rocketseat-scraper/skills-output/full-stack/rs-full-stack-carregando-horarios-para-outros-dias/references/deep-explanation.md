# Deep Explanation: Recarregar Dados ao Mudar Input

## O problema central

Quando voce tem um formulario onde um input (ex: date picker) controla o conteudo de outra secao (ex: lista de horarios), mudar o input precisa:

1. Buscar os novos dados para o valor selecionado
2. **Limpar** o conteudo antigo
3. Renderizar os novos dados

O erro mais comum (e que o instrutor demonstra ao vivo) e pular o passo 2. O resultado: ao mudar a data, os novos horarios sao **adicionados abaixo** dos antigos, criando uma lista que so cresce.

## Por que separar em modulo proprio?

O instrutor cria `date.change.js` como arquivo separado ao inves de adicionar o `onchange` direto no main ou no modulo de load. A razao:

- **Responsabilidade unica**: o modulo de load sabe COMO carregar. O modulo de change sabe QUANDO recarregar. Sao preocupacoes diferentes.
- **Composabilidade**: mais tarde, outros eventos podem precisar do mesmo load (ex: filtro de profissional). Cada trigger fica em seu proprio arquivo.
- **O `load` vai crescer**: o instrutor menciona explicitamente "depois a gente vai ter o load carregando outras coisas tambem, por isso que eu coloquei dentro aqui" — antecipando que a funcao de load sera reutilizada.

## O padrao de registro via import

```javascript
// main.js
import "./form/date.change.js"
```

Isso parece estranho — um import sem usar nada. Mas em vanilla JS com modules, o simples ato de importar executa o codigo top-level do modulo, que registra o event listener. E um padrao comum em projetos sem framework:

- O import garante que o listener existe
- O modulo encapsula sua propria logica
- O main.js funciona como "registro" de todos os comportamentos da pagina

## O bug ao vivo

O instrutor demonstra o bug propositalmente:
1. Dia 15: mostra horarios 19, 20, 21 (corretos para 18h)
2. Muda para dia 16: mostra 8, 9, 10... 21 **abaixo** dos 19, 20, 21 anteriores
3. A lista dobrou ao inves de substituir

A correcao e uma unica linha: `hoursList.innerHTML = ""` no inicio da funcao de load.

## Onde colocar a limpeza

A limpeza fica **dentro da funcao de load**, nao no handler de change. Isso porque:
- O load e chamado tanto no page load inicial quanto no change
- Se a limpeza ficasse so no change, o page load poderia acumular em cenarios de re-render
- Centralizar a limpeza no load garante consistencia independente de quem chama

## Analogia com frameworks modernos

Em React, isso seria resolvido automaticamente pelo re-render baseado em state. Em vanilla JS, voce precisa fazer manualmente o que o virtual DOM faz: limpar e recriar. O `innerHTML = ""` e o equivalente primitivo de um re-render completo do componente.