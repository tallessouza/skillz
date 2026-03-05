# Deep Explanation: Testes de Unidade para Validators

## Por que testar validators que usam FluentValidation?

O instrutor (Ellison) levanta uma objecao comum: "Estamos testando uma biblioteca de terceiros?" A resposta e sim, por dois motivos concretos:

1. **Atualizacao de versao com bug** — Ao atualizar o pacote NuGet do FluentValidation, uma nova versao pode introduzir um bug que altera o comportamento de alguma regra. Se voce tem testes, esse cenario e coberto automaticamente.

2. **Alteracao acidental por outro dev** — Alguem pode, sem querer ou por confusao, alterar a classe de validator. Os testes capturam isso imediatamente.

O ponto-chave: validators sao regras de negocio criticas. Nao importa se a implementacao usa uma biblioteca — o comportamento esperado deve ser garantido por testes.

## O padrao AAA explicado

O instrutor enfatiza a divisao clara em tres partes:

- **Arrange**: Instanciar o validator e a request (usando builder com dados aleatorios via Bogus). Todo o setup necessario.
- **Act**: Chamar `validator.Validate(request)` — a acao que estamos testando.
- **Assert**: Verificar se `result.IsValid` e o esperado, e se as mensagens de erro sao corretas.

Cada funcao de teste DEVE seguir essa estrutura. Nao usar if/switch/for dentro de testes.

## Por que verificar mensagens de erro alem de isValid?

O instrutor da um exemplo concreto: voce envia o nome vazio, o validator retorna `isValid = false`, mas a mensagem diz "e-mail esta vazio". Isso e um bug — o validator esta falhando pelo motivo errado. Verificar apenas `isValid` nao captura esse tipo de problema.

A abordagem correta:
1. Verificar `isValid` e false
2. Verificar que `errors.Count` e exatamente 1 (so forcamos um campo invalido)
3. Verificar que a mensagem de erro e a esperada para aquele campo

## "Copiar e colar a mensagem parece idiota"

O instrutor reconhece que copiar a mensagem do resource e colar no teste parece redundante. Mas explica: neste momento o codigo esta correto, entao o teste serve como guardrail. Se alguem trocar `NAME_EMPTY` por `EMAIL_EMPTY` no validator, o teste falha. O valor do teste esta no futuro, nao no presente.

## ShouldSatisfyAllConditions

Funcao do Shouldly que verifica multiplas condicoes sobre uma colecao. Se qualquer condicao falhar, o teste falha com mensagem clara. E preferivel a multiplos asserts separados porque executa todas as verificacoes mesmo que a primeira falhe, dando feedback completo.

## Organizacao de arquivos de teste

O instrutor segue o padrao:
- Pasta espelha a estrutura do codigo fonte: `Validators.Test/User/Register/`
- Nome da classe: `{ClasseTestada}Tests` → `RegisterUserValidatorTests`
- Nome do metodo: resultado esperado + contexto → `Error_Name_Empty`, `Success`

## Debug de testes no Visual Studio

- Breakpoint na linha desejada
- Botao direito → Debug Test, ou Ctrl+R,T
- F10 para step over linha a linha
- Pode arrastar o cursor de execucao para re-executar linhas