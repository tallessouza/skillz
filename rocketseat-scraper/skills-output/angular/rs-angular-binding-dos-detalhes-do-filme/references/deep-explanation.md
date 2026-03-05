# Deep Explanation: Binding de Detalhes do Filme

## Por que linkedSignal em vez de signal ou computed?

O instrutor escolhe `linkedSignal` deliberadamente, explicando: "futuramente nós vamos atualizar algumas informações dele, então vamos deixar ele no formato de linkedSignal". Um `computed` seria read-only — nao permitiria que o usuario atualizasse o rating localmente. Um `signal` simples nao reagiria automaticamente a mudancas no resource. O `linkedSignal` combina reatividade (reage ao resource) com mutabilidade (permite atualizacoes locais).

## Padrao de tratamento de erro no linkedSignal

O callback do linkedSignal segue um padrao defensivo:

```typescript
const errorOnResponse = !!this.movieDetailsResource.error();
if (errorOnResponse) {
  return undefined;
}
return this.movieDetailsResource.value();
```

A dupla negacao `!!` converte o erro para booleano. Retornar `undefined` em caso de erro evita que o template tente acessar propriedades de um objeto inexistente. O optional chaining (`?.`) no template complementa essa protecao.

## Por que separar a base URL como propriedade readonly?

O instrutor cria `readonly baseUrl = 'http://localhost:3000'` como propriedade do componente. Isso:
1. Centraliza a configuracao — mudar a URL muda em todos os bindings
2. `readonly` previne modificacao acidental
3. Em producao, esse valor viria de um `environment.ts`

## DecimalPipe com locale pt-BR

O formato `'1.0-1'` significa:
- `1` digito inteiro minimo
- `0` digitos decimais minimos
- `1` digito decimal maximo

Entao `3.333` vira `3,3` e `4.0` vira `4`. O terceiro parametro `'pt-BR'` garante virgula como separador decimal.

O instrutor importa o `DecimalPipe` no componente, necessario em componentes standalone do Angular.

## Refatoracao do template

O instrutor remove dois elementos:
1. **Ancora de voltar** — nao utilizada, removida para limpar o template
2. **Span de rating ao lado das estrelas** — substituido por uma secao separada de "média de avaliações"

A motivacao: separar visualmente a media de avaliações (informacao do banco) das estrelas interativas (input do usuario para rating futuro).

## Invocacao de signals no template

O instrutor comete um erro ao vivo e se corrige: "eu estou esquecendo de fazer aqui a invocação do nosso signal, aí ele não faz o autocomplete". Signals no Angular sao funcoes — sem `()` o template recebe o objeto Signal, nao o valor. O autocomplete do IDE so funciona apos a invocacao porque so entao o TypeScript conhece o tipo retornado.