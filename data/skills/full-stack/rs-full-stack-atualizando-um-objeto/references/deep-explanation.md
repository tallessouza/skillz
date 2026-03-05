# Deep Explanation: Atualizando Objetos em JavaScript

## Por que objetos sao mutaveis por padrao

Em JavaScript, objetos sao tipos por referencia. Quando voce declara `const product = {}`, o `const` impede a reatribuicao da variavel, mas NAO impede a modificacao das propriedades internas. Isso significa que `product.name = "mouse"` funciona mesmo com `const`.

Esse comportamento existe porque objetos vivem no heap e a variavel apenas guarda um ponteiro. O `const` protege o ponteiro, nao o conteudo.

## Duas notacoes, mesmo resultado

### Notacao de ponto (`obj.prop`)
- Mais legivel e concisa
- Funciona apenas com nomes de propriedade validos como identificadores (sem espacos, sem comecando por numero)
- E a escolha padrao para 90% dos casos

### Notacao de colchetes (`obj["prop"]` ou `obj[variable]`)
- Aceita qualquer string como chave, inclusive com espacos ou caracteres especiais
- Permite usar variaveis como chave — esse e o caso de uso principal
- Mais verbosa, entao so use quando necessario

## Fluxo mental do instrutor

O instrutor demonstra um padrao pedagogico claro:
1. Cria o objeto com valores iniciais
2. Exibe o valor ANTES da atualizacao (`console.log` antes)
3. Faz a atualizacao
4. Exibe o valor DEPOIS (`console.log` depois)
5. Mostra que tambem funciona com colchetes
6. Exibe o objeto inteiro para confirmar todas as mudancas

Esse padrao de "antes e depois" e valioso para debug — sempre que atualizar um objeto em codigo de desenvolvimento, considere logar o estado anterior.

## Edge cases

- **Propriedade inexistente:** Se voce fizer `obj.novaPropriedade = valor`, JavaScript NAO da erro — ele cria a propriedade. Isso pode ser util mas tambem perigoso (typos criam propriedades fantasma).
- **`Object.freeze()`:** Se o objeto for congelado, atualizacoes silenciosamente falham (ou lancam erro em strict mode).
- **Objetos aninhados:** `product.details.color = "red"` funciona se `details` existir. Se nao existir, da `TypeError`.