# Deep Explanation: Break

## Por que o fall-through existe no switch?

O `switch` em JavaScript herda o comportamento do C. Sem `break`, a execução continua para o próximo `case` independentemente do valor. Isso foi uma decisão de design da linguagem C para permitir que múltiplos cases compartilhem o mesmo código, mas na prática causa mais bugs do que benefícios.

### Demonstração visual do fall-through

Quando `option = 2` e não há `break` em nenhum case:
- Case 1: **pula** (não é 2)
- Case 2: **entra** → executa `console.log("Atualizar")`
- Case 3: **cai para dentro** → executa `console.log("Remover")` mesmo sem ser 3
- Default: **cai para dentro** → executa `console.log("Opção inválida")` mesmo tendo encontrado um case

O ponto-chave do instrutor: o primeiro case que não corresponde é pulado, mas **a partir do case que corresponde, tudo abaixo executa** sem distinção. Isso é o fall-through.

## Posição do break no loop importa

O instrutor demonstrou um detalhe sutil com o `for`:

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break
  }
  console.log(i)
}
```

Resultado: `0, 1, 2, 3, 4` — o número 5 **não aparece** porque o `break` está **antes** do `console.log`. Quando `i` chega em 5, a execução entra no `if`, encontra o `break`, e sai do loop imediatamente. O `console.log(i)` com `i = 5` nunca é alcançado.

Se o `console.log` estivesse **antes** do `if`:

```javascript
for (let i = 0; i < 10; i++) {
  console.log(i)
  if (i === 5) {
    break
  }
}
```

Resultado: `0, 1, 2, 3, 4, 5` — agora o 5 aparece porque o log executa antes da verificação.

Essa diferença é crucial para entender que `break` não "desfaz" o que já executou na iteração atual — ele apenas impede que qualquer código **posterior** no bloco e **futuras iterações** sejam executados.

## Quando usar break vs outras formas de controle

- **`break`**: Sai completamente do loop ou switch
- **`continue`**: Pula para a próxima iteração (não sai do loop)
- **`return`**: Sai da função inteira (mais amplo que `break`)

O `break` é a ferramenta certa quando você quer parar a repetição por completo ao atingir uma condição, mas ainda quer que o código **após o loop** continue executando normalmente.