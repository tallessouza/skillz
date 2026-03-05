# Deep Explanation: Atualizando Token Automático

## Por que não copiar tokens manualmente?

O instrutor começa mostrando a dor: na aula anterior, toda vez que uma sessão era criada, era necessário copiar o token da resposta e colar manualmente no header de autorização de cada request. Isso é:

1. **Trabalhoso** — imagina fazer isso dezenas de vezes durante o desenvolvimento
2. **Propenso a erro** — colar o token errado, esquecer de atualizar uma request
3. **Frágil** — qualquer mudança no backend (ex: alterar role do usuário) gera um novo token que invalida todos os headers fixos

## Como funciona o Response Body Attribute

O Insomnia (e ferramentas similares como Postman) permite **referenciar dinamicamente** valores de respostas anteriores. O mecanismo:

1. Você define uma **referência** no campo do token usando `$response.body.attribute`
2. Essa referência aponta para uma **request específica** (no caso, a de criação de sessão)
3. Um **filtro JSONPath** (`$.token`) extrai o campo desejado do body da resposta
4. Quando você executa a request autenticada, o cliente **resolve a referência** automaticamente

### O ciclo completo

```
POST /sessions (Send)
  → Resposta: { token: "eyJ...", user: { role: "customer" } }
  
GET /customers (Send)
  → Header: Authorization: Bearer [resolve $.token da resposta de /sessions]
  → Usa automaticamente "eyJ..." sem intervenção manual
```

## Armadilha demonstrada na aula

O instrutor mostrou um erro real: ao digitar a referência dinâmica, sobrou um caractere `$` no campo junto do placeholder. O resultado: a request falhava silenciosamente porque o cliente interpretava o `$` como parte literal do token.

**Lição:** sempre verifique que o campo contém APENAS o placeholder dinâmico, sem caracteres residuais.

## Prova de funcionamento

O instrutor demonstrou mudando o role do usuário de `customer` para `sale` no `SessionController`. Ao:

1. Dar Send na sessão → token novo gerado com role `sale`
2. Voltar na request autenticada → automaticamente usa o token atualizado
3. A resposta reflete o novo role sem nenhuma cópia manual

Isso prova que a referência dinâmica resolve o valor em tempo de execução, não em tempo de configuração.

## Analogia

Pense como uma fórmula de planilha: em vez de digitar `42` numa célula, você coloca `=A1`. Quando A1 muda, todas as células que referenciam A1 atualizam automaticamente. O `$response.body.attribute` é a "fórmula" do cliente HTTP.