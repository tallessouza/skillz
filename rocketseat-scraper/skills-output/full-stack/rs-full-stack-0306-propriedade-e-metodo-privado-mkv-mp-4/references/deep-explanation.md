# Deep Explanation: Propriedade e Método Privado

## Por que encapsular com #?

O instrutor demonstra um problema real: ao digitar `database.` no editor (route handler), o autocomplete mostra TUDO que está dentro da classe — incluindo o objeto `database` interno e o método `persist()`. Isso significa que qualquer desenvolvedor pode:

1. **Sobrescrever o estado**: `database.database = "qualquer coisa"` — destruindo todos os dados em memória
2. **Chamar métodos internos**: `database.persist()` — salvando estado inconsistente no arquivo
3. **Criar dependências frágeis**: código externo que depende da estrutura interna quebra quando a implementação muda

## A analogia do "jogo da velha" (#)

O instrutor chama o símbolo `#` de "jogo da velha" (hashtag). Em JavaScript nativo (não TypeScript), o `#` é a única forma real de tornar uma propriedade privada. Diferente do `private` do TypeScript que é apenas em tempo de compilação, o `#` é enforced em runtime — tentar acessar `obj.#prop` de fora gera `SyntaxError`.

## O que deve ser público vs privado

O instrutor usa um critério claro:
- **Público**: métodos que o consumidor da classe precisa chamar (`insert`, `select`)
- **Privado**: tudo que é mecanismo interno (`#database` para armazenamento, `#persist` para salvar em arquivo)

A regra é: **o consumidor deve interagir com a INTENÇÃO (inserir, selecionar), não com o MECANISMO (banco de dados em memória, arquivo no disco)**.

## Processo de migração público → privado

O instrutor mostra um workflow prático no VS Code:
1. Selecionar a palavra (ex: `database`)
2. VS Code destaca TODAS as ocorrências automaticamente
3. Adicionar `#` em CADA ocorrência
4. Selecionar novamente para conferir que todas foram atualizadas
5. Salvar e verificar que o autocomplete agora mostra apenas métodos públicos

Esse processo é importante porque `#database` e `database` são identificadores completamente diferentes em JavaScript — esquecer uma referência causa erro.

## Valor padrão para consultas vazias

O instrutor identifica um bug: quando o arquivo de persistência está vazio e o usuário faz um `select`, o retorno é `undefined`. A correção é retornar um array vazio como fallback:

```javascript
return this.#database[table] ?? []
```

Isso é um padrão defensivo — o consumidor sempre recebe um array, nunca `undefined`.

## Segurança do código

O instrutor enfatiza que encapsulamento é sobre **organização e segurança**: cada método manipula o banco de dados "de acordo com sua função específica". Isso previne que código externo crie caminhos inesperados de mutação do estado.