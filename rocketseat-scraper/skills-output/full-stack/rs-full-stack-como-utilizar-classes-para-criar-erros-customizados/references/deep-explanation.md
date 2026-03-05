# Deep Explanation: Erros Customizados com Classes

## Por que criar classes de erro?

O instrutor demonstra um conceito fundamental: quando você tem apenas `new Error('mensagem')`, o catch não consegue distinguir o que aconteceu. Tudo é "Error". Com classes customizadas, o `instanceof` permite tomar decisões diferentes para cada tipo de falha.

### A analogia do fluxo

O instrutor destaca que `throw` interrompe imediatamente a execução do bloco `try` e redireciona o fluxo para o `catch`. Isso significa que se você tem múltiplos throws, apenas o primeiro será executado — as linhas seguintes ficam "apagadas" (unreachable code). Essa é uma observação prática importante: a ordem dos throws importa.

### O padrão this.message

Na aula, o instrutor usa `this.message` diretamente para armazenar a mensagem concatenada com um prefixo. Quando se herda de `Error` com `super(message)`, a propriedade `message` já é definida automaticamente. O padrão mostrado na aula (sem extends Error) funciona, mas a versão com herança é mais robusta porque:

1. **Stack trace preservado** — `Error.captureStackTrace` funciona automaticamente
2. **instanceof na cadeia** — `error instanceof Error` retorna true
3. **Compatibilidade** — bibliotecas de logging e frameworks esperam instâncias de Error

### Herança vs composição simples

A versão da aula usa uma classe simples com `this.message`:

```javascript
class MyCustomError {
  constructor(message) {
    this.message = `Classe de erro customizada: ${message}`
  }
}
```

Isso funciona para `instanceof MyCustomError`, mas falha para `instanceof Error`. Em produção, sempre use `extends Error`.

### Quando o instanceof falha

O instructor mostra que quando um `Error` genérico é lançado antes do customizado, o catch cai no `else`. Isso prova que o `instanceof` está funcionando corretamente como discriminador. O padrão correto é sempre ter um else/default para erros inesperados.

### Edge cases importantes

1. **Erros em promises** — `throw` dentro de async function vira rejection. Classes customizadas funcionam igual.
2. **Re-throw** — Às vezes você quer capturar, logar, e relançar: `catch(e) { log(e); throw e }`
3. **Erros de terceiros** — Bibliotecas lançam seus próprios erros. Wrape-os nos seus erros de domínio.
4. **Serialização** — `JSON.stringify(error)` não inclui `message` e `stack` por padrão. Adicione `toJSON()` se precisar.

### Flexibilidade mencionada pelo instrutor

O instrutor enfatiza que classes de erro customizadas dão "bastante flexibilidade". Concretamente isso significa:

- Adicionar propriedades extras (código, campo, metadata)
- Criar hierarquias (AppError → ValidationError → RequiredFieldError)
- Personalizar mensagens com prefixos/contexto automaticamente
- Reagir diferentemente no catch baseado no tipo