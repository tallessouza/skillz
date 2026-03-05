# Deep Explanation: Classes para Lidar com Exceções

## Por que o JavaScript usa classes para erros

O JavaScript tem classes de erro nativas (`Error`, `TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`, etc.) que herdam de `Error`. Quando algo falha internamente — como chamar um método inexistente — o runtime lança automaticamente uma instância da classe apropriada. Por exemplo, `obj.execute()` quando `execute` não existe gera um `TypeError`.

O ponto crucial da aula: **você pode usar essas mesmas classes para lançar seus próprios erros**, e pode usar `instanceof` para identificar qual tipo de erro ocorreu no catch.

## throw se comporta como return

O instrutor enfatiza que `throw` interrompe a execução do bloco atual exatamente como `return`. Isso significa:

```javascript
if (!items.includes(17)) {
  throw new Error("17 não está disponível")
}
// Este código SÓ executa se 17 estiver na lista
if (index > 99) {
  throw new RangeError("Fora do intervalo")
}
```

Se o primeiro `throw` executa, o segundo `if` nunca é avaliado. O fluxo salta direto para o `catch`.

## instanceof — identificando a classe do erro

`error instanceof TypeError` verifica se o erro foi criado pela classe `TypeError` (ou uma subclasse dela). Isso permite tratamento diferenciado:

- **TypeError** — acessar método/propriedade que não existe no tipo
- **RangeError** — valor numérico fora do intervalo esperado
- **SyntaxError** — erro de parsing de código
- **ReferenceError** — variável não declarada
- **Error** — classe base genérica

## Encadeamento: específico → genérico

A analogia é como filtros: coloque os mais restritivos primeiro. Se você colocar `instanceof Error` primeiro, ele captura TUDO (porque todas as classes herdam de Error), e os checks específicos nunca executam.

```javascript
// CORRETO: específico primeiro
if (error instanceof RangeError) { ... }
else if (error instanceof TypeError) { ... }
else { /* genérico */ }

// ERRADO: Error captura tudo
if (error instanceof Error) { ... } // sempre entra aqui
else if (error instanceof RangeError) { ... } // nunca alcança
```

## error vs error.message

- `console.log(error)` → mostra `RangeError: mensagem aqui` (classe + mensagem)
- `console.log(error.message)` → mostra apenas `mensagem aqui`

Para mensagens amigáveis ao usuário, use `.message`. Para debugging/logs internos, o erro completo pode ser mais útil.

## Conexão com o construtor de classes

O instrutor destaca que `new Error("mensagem")` está chamando o **construtor** da classe Error, passando a mensagem como argumento — exatamente o mesmo padrão de `new MinhaClasse(argumento)`. Isso conecta o conceito de classes (aula anterior) com uso prático em tratamento de erros.

## Padrão para código real

O instrutor sugere o padrão mental: ao escrever uma função que envia dados ao banco, por exemplo, você antecipa exceções específicas (banco indisponível, dado inválido, permissão negada) e trata cada uma com uma mensagem amigável diferente, deixando um else genérico para o inesperado.