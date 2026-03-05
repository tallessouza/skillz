# Deep Explanation: Gerando Coverage de Testes

## O que e coverage e por que importa

Coverage e uma metrica que mede a quantidade de codigo que esta sendo testada. A duvida mais comum de quem comeca a testar e: "Sera que eu testei o suficiente? Sera que eu esqueci de alguma coisa?" Coverage responde isso visualmente.

## O problema do await em expects asincronos

O Diego (instrutor) voltou para gravar um adendo sobre um problema sutil: quando voce faz `expect` de uma promise (como um `execute()` de um use case), o Vitest pode nao aguardar a promise resolver antes de seguir em frente.

Isso causa dois problemas:
1. O teste pode passar mesmo quando deveria falhar (falso positivo)
2. O coverage mostra cobertura incorreta — linhas que parecem cobertas mas nao foram realmente executadas

A solucao e simples: sempre usar `await` dentro do `expect` quando ha uma promise. Especificamente em patterns como `rejects.toBeInstanceOf()`.

## Como ler o relatorio de coverage

Ao abrir `coverage/index.html`:
- Cada arquivo listado mostra percentual de cobertura
- Ao clicar num arquivo, voce ve o codigo fonte com anotacoes
- Numeros ao lado das linhas (1x, 4x, etc.) indicam quantas vezes testes passaram por aquela linha
- Se voce tem 3 testes e uma linha mostra `3x`, todos os testes executam aquela linha
- O `describe` pode contar como uma execucao adicional

## Metodos uteis do `it`

- `it.skip('nome', ...)` — pula o teste. O coverage vai imediatamente mostrar em vermelho as linhas que aquele teste cobria
- `it.only('nome', ...)` — executa somente aquele teste. Util para depuracao focada

## A filosofia do Diego sobre coverage

O instrutor e enfatico: **nao busque 100% de coverage**. O coverage e uma ferramenta para voce olhar e perceber "opa, como eu esqueci de testar isso?" — nao uma meta absoluta.

Vai ter codigo que testes nao cobrem e tudo bem. Voce conscientemente decide "nao preciso de teste pra isso". O importante e que a decisao seja consciente, nao um esquecimento.

## Prioridade de cobertura

O instrutor destaca que os arquivos mais importantes para verificar coverage sao os **use cases** (casos de uso). Sao eles que contem a logica de negocio e os caminhos de erro que precisam ser testados.

## O efeito visual do skip

Quando o Diego usou `it.skip` no teste de email duplicado e rodou coverage novamente, o grafico ficou vermelho imediatamente — mostrando visualmente que o `if` de verificacao de email duplicado nao estava mais coberto. Isso demonstra o poder do coverage como ferramenta de feedback rapido.