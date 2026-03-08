# Deep Explanation: Validação de Dados com Zod em Formulários React

## Por que Zod no cliente e não validação manual?

O instrutor demonstra um padrão onde o schema Zod é definido fora do componente e usado com `parse` dentro do submit handler. A razão é centralização: quando você valida manualmente com `if/else`, cada campo tem sua própria lógica espalhada pelo handler. Com Zod, todas as regras ficam declarativas em um único objeto.

O `parse` lança exceção propositalmente — isso permite que o try-catch capture tanto erros de validação quanto erros de rede/runtime no mesmo bloco, simplificando o fluxo.

## Fluxo try-catch-finally para formulários

O padrão ensinado segue uma sequência precisa:

1. **try**: Ativa loading → valida com parse → executa operação → navega
2. **catch**: Diferencia ZodError (mostra `issues[0].message`) de erro genérico (mensagem fallback)
3. **finally**: Desativa loading independente do resultado

O `finally` é crítico. Se o loading fosse resetado no try (após sucesso) e no catch (após erro), haveria duplicação. Pior: se um erro inesperado não fosse capturado, o botão ficaria travado eternamente. O `finally` garante que o estado sempre volta ao normal.

## Normalização de moeda brasileira

No Brasil, valores monetários usam vírgula como separador decimal: `125,50`. O JavaScript espera ponto: `125.50`. O instrutor faz `amount.replace(",", ".")` antes de passar ao Zod.

O `z.coerce.number()` tenta converter a string para número automaticamente. Se a string contiver vírgula sem a substituição, o `coerce` falha porque `Number("125,50")` retorna `NaN` em JavaScript. A substituição prévia garante que a coerção funcione.

## Validação progressiva com mensagens específicas

O schema define mensagens diferentes para cada regra:
- `min(3)` no nome → "Informe um nome claro para sua solicitação"
- `min(1)` na categoria → "Informe a categoria"
- `coerce.number()` no amount → "Informe um valor válido"
- `.positive()` no amount → "Informe um valor válido e superior a zero"

O instrutor exibe apenas `error.issues[0].message` — o primeiro erro encontrado. Isso evita sobrecarregar o usuário com múltiplos erros simultâneos, criando uma experiência de validação sequencial onde o usuário resolve um problema por vez.

## Loading state no botão de submit

O `isLoading` é um estado React que:
1. Desabilita o botão (`disabled={isLoading}`)
2. Mostra um indicador visual de processamento

Isso previne duplo-click e dá feedback ao usuário de que algo está acontecendo. O instrutor ativa no início do try (antes da validação) porque mesmo a validação pode levar tempo perceptível com schemas complexos.

## `parse` vs `safeParse`

O instrutor usa `parse` que lança exceção, não `safeParse` que retorna `{ success, data, error }`. A escolha é deliberada: como já existe um try-catch para erros de rede/runtime, usar `parse` mantém o código linear sem necessidade de verificar `result.success` manualmente.

Se o formulário precisasse exibir erros inline (não via alert), `safeParse` seria mais adequado porque permite mapear `issues` para campos específicos.

## Fluxo de navegação pós-validação

Após validação bem-sucedida, o instrutor navega para uma página de confirmação (`/confirm`). Essa página contém imagem, título, descrição e link para voltar. O padrão é: formulário → validação → operação → confirmação → retorno. A navegação só acontece dentro do try, garantindo que nunca ocorre se a validação falhar.