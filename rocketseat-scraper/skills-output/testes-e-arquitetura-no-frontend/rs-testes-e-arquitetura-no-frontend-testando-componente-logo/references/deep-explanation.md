# Deep Explanation: Testando Componente Logo

## toBeVisible vs toBeInTheDocument — A distincao critica

O instrutor destaca uma diferenca fundamental que muitos desenvolvedores ignoram:

- **`toBeVisible()`**: Verifica se o elemento esta de fato visivel para o usuario. Elementos com `display: none`, `visibility: hidden`, ou `opacity: 0` falham nessa asserção.
- **`toBeInTheDocument()`**: Apenas verifica se o elemento existe no DOM. Um elemento com `display: none` ainda passa nesse teste.

### Quando isso importa na pratica

Imagine um componente que condicionalmente esconde o logo em telas mobile via CSS (`display: none` em breakpoints pequenos). Se voce usa `toBeInTheDocument`, seu teste passa mesmo que o usuario nunca veja o logo. Com `toBeVisible`, voce captura esse cenario.

### Preferencia do instrutor

> "Eu, particularmente, na maioria dos cenarios, eu prefiro utilizar o `toBeVisible` quando eu quero garantir que, de fato, o usuario esta visualizando aquele conteudo."

A regra geral: use `toBeVisible` como padrao. So use `toBeInTheDocument` quando voce explicitamente quer testar presenca no DOM independente de visibilidade (ex: tooltips que aparecem on hover, modais fechados).

## Quando usar makeSut

O instrutor menciona que para componentes com um unico teste, criar uma funcao `makeSut` (System Under Test) adiciona complexidade desnecessaria. O padrao `makeSut` brilha quando:

- Ha multiplos testes que compartilham o mesmo setup
- O componente precisa de props diferentes por teste
- O setup envolve mocks ou providers

Para o Logo, que tem literalmente 1 teste, renderizar direto e mais claro.

## Contexto no curso

Este teste finaliza a cobertura unitaria de todos os componentes da sidebar. O proximo passo do curso e testes end-to-end, que testam fluxos completos do usuario. A distincao entre testes unitarios (componente isolado) e E2E (fluxo completo) sera explorada nas proximas aulas.