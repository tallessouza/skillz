# Deep Explanation: Testes de Unidade para Cenarios de Erro

## Modelo mental: expectativa vs realidade

O instrutor usa uma analogia clara: o teste de unidade faz Assert comparando resultado esperado vs resultado recebido. Quando o teste espera um valor e recebe uma excecao, falha. Mas quando o teste ESPERA uma excecao e ela acontece, passa. A chave e: **tudo e questao de alinhar expectativa com resultado**.

Cenarios:
- Teste espera valor, recebe excecao → **FALHA**
- Teste espera excecao, recebe excecao do tipo certo → **PASSA**
- Teste espera excecao, nenhuma excecao acontece → **FALHA**
- Teste espera excecao tipo A, recebe excecao tipo B → **FALHA**

## Por que armazenar a funcao em uma variavel?

A sintaxe `var act = async () => await useCase.Execute(request)` armazena a **referencia** da funcao, nao a executa. Quem executa e o FluentAssertions via `act.Should().ThrowAsync<T>()`. Isso permite ao framework:
1. Envolver a execucao em try/catch
2. Capturar a excecao
3. Validar o tipo
4. Devolver a excecao para assertions adicionais

Se voce executar diretamente (`await useCase.Execute(request)`), a excecao sobe antes do framework poder captura-la.

## Estrategia de cobertura: nao duplique o validator

O instrutor faz uma decisao arquitetural importante: se o validator ja tem testes para nome vazio, email vazio, email invalido, senha fraca — o use case NAO precisa re-testar cada campo. O use case so precisa garantir:

1. **Validator reclamou → excecao lancada** (1 teste com qualquer campo invalido)
2. **Regra de negocio propria do use case** (ex: email duplicado no banco)

Isso evita testes redundantes e mantem a suite rapida.

## Como identificar cenarios de erro

O instrutor enfatiza: "E voce conhecer o codigo, nao tem outra forma." Voce precisa:
1. Ler a funcao `Execute` do use case
2. Identificar cada `if` que pode lancar excecao
3. Identificar se o cenario vem do validator ou de regra de negocio
4. Criar um teste para cada caminho distinto

No exemplo, a funcao `Validate` tem dois IFs:
- IF email ja existe no banco → adiciona erro → lanca excecao
- IF validator tem erros (campos invalidos) → lanca excecao

## Mock com parametro opcional: pattern elegante

O builder do repositorio aceita email como parametro opcional. Se nao recebe nada, o mock nao configura nenhum comportamento especial. Se recebe um email, configura para retornar `true` em `ExistsActiveUserWithEmail`. Isso permite que o MESMO builder sirva para cenarios de sucesso (sem email) e de erro (com email).

## Complementando assertions no caminho feliz

O instrutor tambem mostra que o teste de sucesso pode ser enriquecido:
- `result.Id.Should().NotBe(Guid.Empty)` — ID nao pode ser GUID zerado
- `result.Tokens.Should().NotBeNull()` — tokens devem existir
- `result.Tokens.AccessToken.Should().NotBeEmpty()` — access token preenchido
- `result.Tokens.RefreshToken.Should().NotBeEmpty()` — refresh token preenchido