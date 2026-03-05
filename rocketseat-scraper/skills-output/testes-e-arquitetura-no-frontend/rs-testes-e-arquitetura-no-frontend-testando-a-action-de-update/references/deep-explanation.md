# Deep Explanation: Testando Actions de Update

## Por que resetar mocks no beforeEach e critico

O instrutor destaca que esqueceu de incluir o reset do `updateExecute` no `beforeEach` da aula anterior. Embora os testes tenham passado, isso e um risco: sem reset, um mock configurado em um teste pode vazar para outro, causando falsos positivos ou falsos negativos. A regra e: todo mock de use case deve ser resetado no `beforeEach`, mesmo que ainda nao esteja sendo usado nos testes atuais.

## A decisao de repetir testes entre niveis

O instrutor levanta uma questao importante: "Ate que ponto faz sentido repetir testes que ja existem em nivel de unidade no nivel de integracao?" A resposta dele e pragmatica — depende do cenario. Para o caso de "prompt not found", ja testado no use case, faz sentido repetir na action porque:

1. A action tem logica propria de tratamento (o `if` que diferencia erro especifico do generico)
2. Um bug na action poderia engolir o erro ou retornar a mensagem errada
3. O custo do teste e baixo comparado ao risco

## Organizacao: sucesso antes de erros

O instrutor menciona preferencia pessoal de colocar cenarios de sucesso no topo do `describe`. A justificativa: o caminho feliz e geralmente mais simples (um cenario), enquanto erros tem mais bifurcacoes. Isso facilita a leitura top-down do arquivo de teste.

## toMatchObject vs propriedade por propriedade

O instrutor mostra duas formas de verificar o retorno:

**Propriedade por propriedade:**
```typescript
expect(result.success).toBe(true)
expect(result.message).toBe('Prompt atualizado com sucesso')
```

**toMatchObject:**
```typescript
expect(result).toMatchObject({
  success: true,
  message: 'Prompt atualizado com sucesso',
})
```

Ambas funcionam, mas `toMatchObject` escala melhor quando o objeto tem muitas propriedades. Para duas propriedades a diferenca e pequena, mas o instrutor recomenda pensar em objetos maiores.

## Por que mockResolvedValue explicito no sucesso

O instrutor destaca: quando o use case nao lanca erro, a action passa direto pelo try/catch e retorna sucesso. Tecnicamente, o mock sem configuracao ja retornaria `undefined`, mas usar `mockResolvedValue(undefined)` explicito torna a intencao clara — "eu sei que esse mock retorna vazio e e de proposito".

## O efeito cascata do coverage

Um insight importante: ao testar a action de update (validacao Zod especificamente), o coverage do `update.dto` tambem subiu — de ~60% para 100%. Isso acontece porque o teste de validacao na action executa o schema Zod definido no DTO. Cobrir um arquivo pode indiretamente cobrir outros que ele importa.

## Cuidado ao copiar mocks

O instrutor alerta explicitamente: "Muito cuidado com essa parte de copiar aqui, que a gente acaba esquecendo de algumas coisinhas." Ao copiar o mock de `createExecute` para criar `updateExecute`, e preciso substituir TODAS as referencias — nome da variavel, nome do modulo mockado, e nome da classe. Esquecer uma referencia causa bugs sutis.

## Branches e Functions no coverage

O instrutor faz questao de dizer: "Muita gente olha so statements. Mas branches e functions sao importantissimos." Statements pode estar em 97% enquanto branches esta em 80% — significando que varios `if/else` nao estao cobertos. Branches e o indicador mais confiavel de que todos os caminhos da action foram testados.