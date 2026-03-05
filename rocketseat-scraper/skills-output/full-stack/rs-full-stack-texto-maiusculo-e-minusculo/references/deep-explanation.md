# Deep Explanation: Texto Maiúsculo e Minúsculo

## Por que strings são imutáveis em JavaScript

Strings em JavaScript são valores primitivos imutáveis. Quando você chama `toUpperCase()` ou `toLowerCase()`, o engine cria uma **nova string** na memória e retorna essa nova referência. A string original permanece intacta.

Isso é um ponto de confusão comum para iniciantes que esperam que o método modifique a variável diretamente (como `array.push()` modifica o array). O instrutor enfatiza esse ponto: **"ele não modifica o conteúdo da variável, o que ele faz é exibir o conteúdo em maiúsculo"**.

## Como o instrutor demonstrou

1. Criou uma variável `message` com texto misto (maiúsculas e minúsculas)
2. Mostrou `console.log(message)` — texto original
3. Mostrou `console.log(message.toUpperCase())` — tudo maiúsculo
4. Mostrou `console.log(message.toLowerCase())` — tudo minúsculo
5. Reforçou que `message` não foi alterada em nenhum momento

## Insight do instrutor

O instrutor destaca que `toUpperCase` e `toLowerCase` são **métodos disponíveis dentro da própria string**. Isso significa que qualquer valor string em JavaScript já tem acesso a esses métodos — não é necessário importar nada ou converter tipos.

## Edge cases

- **Caracteres acentuados:** `"café".toUpperCase()` retorna `"CAFÉ"` — funciona corretamente com acentos em português
- **Números e símbolos:** `"abc123!@#".toUpperCase()` retorna `"ABC123!@#"` — caracteres não-alfabéticos permanecem iguais
- **String vazia:** `"".toUpperCase()` retorna `""` — sem erro
- **Emojis:** `"hello 🚀".toUpperCase()` retorna `"HELLO 🚀"` — emojis não são afetados

## Quando usar na prática

- **Normalização de input:** Antes de salvar email no banco, `email.toLowerCase()` garante consistência
- **Comparação:** Nunca compare strings com casing misto diretamente — normalize primeiro
- **Exibição:** Use para formatar texto na UI sem alterar os dados originais