# Deep Explanation: Validando Input com Regex

## Por que regex + replace em vez de bloquear teclas?

A abordagem do instrutor é elegante por um motivo: em vez de tentar interceptar cada tecla e decidir se permite ou não (keydown/keypress), ele deixa o valor entrar e imediatamente limpa. Isso é mais robusto porque:

1. **Cobre paste** — o usuário pode colar "abc123" e o regex limpa
2. **Cobre autocomplete** — valores preenchidos automaticamente também passam pelo filtro
3. **Cobre drag-and-drop** — texto arrastado para o campo é filtrado
4. **Não depende de keyCodes** — que variam entre teclados e layouts

## Anatomia da regex `/\D+/g`

| Parte | Significado |
|-------|-------------|
| `/` | Início da expressão regular |
| `\D` | Qualquer caractere que NÃO é dígito (equivale a `[^0-9]`) |
| `+` | Um ou mais caracteres em sequência (otimização — pega "abc" de uma vez em vez de "a", "b", "c" separados) |
| `/` | Fim da expressão regular |
| `g` | Flag global — busca em toda a string, não para no primeiro match |

## O método replace

O `replace` recebe dois argumentos:
1. **Padrão** — o que procurar (nossa regex)
2. **Substituição** — por que trocar (string vazia `""` = remover)

O fluxo é:
```
"123abc456" → replace encontra "abc" → substitui por "" → "123456"
```

## Por que reatribuir ao próprio input?

A linha `amount.value = amount.value.replace(...)` faz duas coisas:
1. Lê o valor atual (que pode conter letras)
2. Escreve de volta o valor limpo

O usuário vê o campo "engolir" as letras — ele digita mas elas não aparecem. Na verdade aparecem por um instante imperceptível e são removidas.

O instrutor demonstra isso com um `console.log(amount.value)` antes do replace — ali as letras aparecem no console, provando que elas chegam ao campo mas são imediatamente removidas pela reatribuição.

## Flag `g` (global) é essencial

Sem a flag `g`, o replace só substitui a primeira ocorrência. Se o usuário colar "a1b2c3", sem `g` o resultado seria "1b2c3" (só o primeiro "a" removido). Com `g`, todas as letras são removidas: "123".

## Limitações desta abordagem

- Não permite decimais (ponto/vírgula são removidos junto)
- Não formata o número (ex: separador de milhares)
- Para inputs monetários completos, é só o primeiro passo — o curso avança com formatação depois