# Deep Explanation: Pattern de Composição

## Por que nao usar props para tudo?

O instrutor demonstra o problema progressivo: voce comeca com um componente `<Input>` simples. Ai precisa customizar o container — cria prop `className`. Ai precisa customizar o icone — cria `iconClassName`. Ai precisa mudar o icone por uma imagem — cria `icon` como prop. Ai precisa colocar o icone na direita — cria `iconPosition`. Cada variacao visual gera uma nova prop, e o componente cresce em complexidade exponencialmente.

O composition pattern resolve isso invertendo o controle: ao inves do componente decidir como renderizar cada parte, o **consumidor** decide o que colocar em cada posicao.

## A analogia do "conjunto de tres coisas"

O instrutor enfatiza: "esse input nao e so o input. Ele e uma div. Ele e o icone. Ele e o input. Entao ele e um conjunto de tres coisas." Essa observacao e o gatilho para aplicar composition: quando um componente visual e composto por partes distintas, cada parte deve ser um componente.

## Nomeando pela posicao, nao pelo conteudo

O nome `InputPrefix` foi escolhido ao inves de `InputIcon` porque "pode ser que a pessoa nao queira colocar um icone ali naquela parte, quer colocar uma imagem, uma coisa assim". Nomear pelo conteudo (`Icon`) limita o uso mental do componente. Nomear pela posicao (`Prefix`) deixa claro que qualquer coisa pode ir ali.

## Dois estilos de exportacao no ecossistema

### Estilo Radix (namespace com ponto)
```typescript
import * as Input from './input'
// Input.Root, Input.Prefix, Input.Control
```
O Radix UI popularizou esse padrao. Vantagem: importacao unica, agrupa visualmente.

### Estilo shadcn/ui (nomes completos)
```typescript
import { InputRoot, InputPrefix, InputControl } from './input'
```
O shadcn/ui usa esse padrao. Vantagem: tree-shaking mais explicito, sem namespace.

Ambos sao validos. O instrutor mostra os dois e diz "escolha o que te agradar mais".

## ComponentProps vs interfaces manuais

Usar `ComponentProps<'div'>` do React automaticamente herda todas as props que uma `<div>` aceita (className, onClick, style, aria-*, data-*, etc). Isso elimina a necessidade de criar interfaces manuais e garante que o sub-componente aceita qualquer customizacao que o elemento nativo aceitaria.

## Quando NAO usar composition

O pattern faz sentido quando ha partes visuais distintas que o consumidor pode querer customizar independentemente. Para componentes simples com uma ou duas variacoes (ex: botao com `size="sm" | "lg"`), uma prop simples e mais adequada. Composition pattern adicionaria complexidade desnecessaria nesses casos.