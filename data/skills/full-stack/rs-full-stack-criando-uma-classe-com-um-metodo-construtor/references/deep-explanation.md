# Deep Explanation: Classes e Método Construtor em JavaScript

## Por que PascalCase para classes?

O instrutor destaca tres convencoes de nomenclatura e quando usar cada uma:

- **PascalCase** (`MyClass`) — para classes. Cada palavra comeca com maiuscula. E a convencao de mercado para diferenciar classes de variaveis e funcoes. Nao e obrigatorio — escrever tudo minusculo nao gera bug — mas e um padrao forte na comunidade.
- **camelCase** (`myVariable`) — para variaveis e funcoes. Primeira palavra minuscula, demais com maiuscula inicial.
- **snake_case** (`my_variable`) — tudo minusculo separado por underline.

O ponto-chave: **sao convencoes, nao regras da linguagem**. O codigo funciona independente do case. Mas seguir o padrao torna o codigo legivel e previsivel para outros desenvolvedores.

## O que e o constructor?

O `constructor` e uma **funcao especial** que pertence a classe. Suas caracteristicas:

1. **Executa automaticamente** — ao instanciar com `new`, o constructor roda sem precisar chama-lo explicitamente
2. **Recebe parametros** — voce pode passar dados no momento da instanciacao: `new Person('Rodrigo')`
3. **E o ponto de entrada** — toda logica de inicializacao da instancia deve estar ali

### Analogia do instrutor

O instrutor usa o exemplo pratico: ao instanciar `new Person('Rodrigo')`, a mensagem do `console.log` dentro do constructor aparece imediatamente no terminal, mesmo sem "usar" a classe para nada. Isso demonstra que o constructor roda no momento da instanciacao, nao quando voce chama um metodo.

## Instanciacao com `new`

A keyword `new` faz tres coisas:
1. Cria um novo objeto vazio
2. Liga o `this` desse objeto ao contexto da classe
3. Executa o `constructor` automaticamente

Sem `new`, voce nao cria uma instancia — e um erro comum de iniciantes.

## Comportamento do console.log com multiplos parametros

O instrutor mostra um detalhe util: `console.log('Ola', name)` adiciona automaticamente um espaco entre os parametros. Nao precisa concatenar com `' ' + name` — o proprio `console.log` trata cada argumento como texto separado com espaco.