# Deep Explanation: Inputs Controlados e Não Controlados

## O problema fundamental

No React, o estado vive no JavaScript e a interface vive no DOM. Quando usamos `useState` para guardar o valor de um input, criamos uma **cópia** do valor. Se alteramos essa cópia (ex: `setName("")`), o DOM não sabe que mudou — a menos que o input esteja **vinculado** ao estado via `value`.

## Analogia do instrutor

Pense no input como um espelho:
- **Input não controlado:** o espelho mostra o que o usuário digita, mas se você tentar mudar o reflexo por trás, o espelho ignora
- **Input controlado:** o espelho está conectado ao estado — se o estado muda, o reflexo muda junto

## Fluxo de dados

### Input não controlado
```
Usuário digita → onChange captura → setState atualiza
                                     ↓
                              Estado: "" (limpo)
                              Input: "React" (ainda visível!) ← DESSINCRONIZADO
```

### Input controlado
```
Usuário digita → onChange captura → setState atualiza
                                     ↓
                              Estado: "" (limpo)
                              Input: "" (limpo!) ← value={estado} garante sincronia
```

## Quando usar cada tipo

### Input controlado (maioria dos casos)
- Precisa limpar campos após submit
- Precisa validar em tempo real
- Precisa formatar enquanto digita (máscara de telefone, CPF)
- Precisa preencher com dados vindos de API
- Precisa desabilitar botão baseado no conteúdo

### Input não controlado (casos específicos)
- Formulários extremamente simples (1-2 campos)
- Upload de arquivo (`<input type="file" />` — sempre não controlado no React)
- Integração com bibliotecas DOM legadas
- Performance crítica com milhares de inputs (caso raro)

## O valor inicial

O instrutor demonstrou que `useState("Rodrigo")` faz o input já renderizar com "Rodrigo" preenchido. Isso é diferente de `defaultValue`:

- `useState("Rodrigo")` + `value={name}` → controlado, valor inicial "Rodrigo", pode ser mudado via `setName`
- `defaultValue="Rodrigo"` → não controlado, valor inicial "Rodrigo", React não controla depois

## Edge case: por que o React "reclama" sem onChange?

Se você coloca `value={name}` sem `onChange`, o React emite um warning porque o input fica **read-only** — o usuário não consegue digitar. O `value` trava o input no valor do estado, e sem `onChange` não há como atualizar o estado.

## Resumo mental

- `onChange` sozinho = **leitura** do input (não controlado)
- `value` + `onChange` = **leitura e escrita** do input (controlado)
- `value` sozinho = input **travado** (read-only, warning no console)