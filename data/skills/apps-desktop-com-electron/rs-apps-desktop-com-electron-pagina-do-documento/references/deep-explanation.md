# Deep Explanation: Página do Documento

## Por que sticky e não fixed?

O instrutor faz uma distinção importante entre `position: sticky` e `position: fixed`. O sticky mantém o elemento no flow do documento — ele se comporta como `relative` até que o scroll atinja o ponto de referência (definido por `top: 0`), quando então "gruda" na posição. Já o `fixed` remove completamente o elemento do flow, o que causaria problemas de layout com o conteúdo ao lado.

O `top-0` é obrigatório porque o sticky precisa de um ponto de referência para saber ONDE grudar. Sem ele, o comportamento é indefinido.

## Por que limitar a largura do texto?

O instrutor compartilha um insight de experiência prática: durante o desenvolvimento, ele percebeu que texto ocupando 100% da largura em monitores grandes (2560px) fica "muito estendido e até difícil de ler". Ele referencia blogs famosos que limitam texto a 600-700px de largura.

Isso é um princípio de tipografia: a medida ideal de uma linha de texto é de 45-75 caracteres. Em telas muito largas, linhas longas demais forçam o olho a percorrer distâncias grandes, dificultando encontrar o início da próxima linha.

A solução: uma div com largura fixa centralizada via `flex-col items-center` na section pai.

## Composition Pattern (Compound Components)

O instrutor usa o pattern de composição para o componente Table of Contents. Ao invés de um componente único com props complexas, ele exporta subcomponentes:

```tsx
import { Toc } from './components/toc'

// Uso com composição — flexível e legível
<Toc.Root>
  <Toc.Link>Backend</Toc.Link>
  <Toc.Section>
    <Toc.Link>Banco de dados</Toc.Link>
  </Toc.Section>
</Toc.Root>
```

`Toc.Section` cria um nível de indentação, representando sub-itens (como H3 dentro de H2). Esse pattern é comum em bibliotecas como Radix UI e Headless UI.

## Semântica HTML: span vs strong

O instrutor inicialmente usa `<strong>` para o título "Table of contents", mas se corrige: `<strong>` semanticamente indica que o texto tem mais importância no contexto do documento. O título da sidebar não tem importância semântica especial — ele é visualmente em negrito por estilo, não por significado. Por isso, `<span>` com classes de estilo (`font-semibold`) é a escolha correta.

## Estrutura de padding

- `py-12` = 48px vertical (topo e fundo)
- `px-10` = 40px horizontal (laterais)
- `gap-8` = 32px entre sidebar e conteúdo

Esse padding assimétrico dá mais respiro vertical do que horizontal, adequado para documentos onde o scroll vertical é o comportamento principal.