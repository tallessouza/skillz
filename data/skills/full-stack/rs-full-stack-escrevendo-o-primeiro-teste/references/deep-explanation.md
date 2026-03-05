# Deep Explanation: Escrevendo o Primeiro Teste

## O que e um teste automatizado

Um teste automatizado trabalha em cima de **expectativa**. Voce define qual e o comportamento esperado de uma funcao e o framework (Jest) verifica automaticamente se a realidade corresponde a expectativa.

O fluxo mental e:
1. Tenho uma funcao com comportamento conhecido
2. Chamo a funcao com inputs conhecidos
3. Comparo o output real com o output esperado
4. Se coincidem: teste passa. Se diferem: teste falha.

## Por que nomes descritivos importam

Quando um teste falha, o Jest exibe:
- O **nome do teste** (a string que voce passou para `test()`)
- O **valor esperado** (Expected)
- O **valor recebido** (Received)
- A **linha exata** onde a asserção falhou

Se o nome do teste e `"test 1"`, voce precisa abrir o arquivo e ler o codigo para entender o que falhou. Se o nome e `"sum of 3 and 7 must be 10"`, voce ja sabe exatamente o que estava sendo testado sem abrir nenhum arquivo.

O instrutor enfatiza: **"fica bem mais claro o que eu estou testando"** — o nome do teste e documentação viva.

## Falsos positivos e a tecnica de verificação

O instrutor destaca um conceito critico: **falso positivo**. Um teste pode passar por motivos errados:
- A asserção esta incorreta
- O teste nao esta realmente exercitando o codigo
- O valor esperado coincide por acidente

A tecnica para evitar falsos positivos:
1. Escreva o teste e veja passar
2. **Mude o valor esperado para algo errado** (ex: troque 10 por 17)
3. Execute — o teste DEVE falhar
4. Se falhou: bom, o teste esta realmente validando algo
5. Volte ao valor correto

Nas palavras do instrutor: *"Sempre e bom voce validar o contrario pra ver se ele tambem se comporta conforme o esperado, se voce simular ali um erro."*

## Anatomia da saida de falha do Jest

Quando um teste falha, o Jest mostra:

```
● sum of 3 and 7 must be 10

  expect(received).toBe(expected)

  Expected: 17
  Received: 10

    > 6 |   expect(result).toBe(17)
        |                  ^
```

Leitura:
- **Expected**: o valor que VOCE colocou no `toBe()` — sua expectativa
- **Received**: o valor que a FUNCAO retornou — a realidade
- **Seta (^)**: aponta exatamente a linha e o metodo que falhou

## Export e isolamento

Para testar uma funcao, ela precisa ser acessivel no arquivo de teste. O instrutor usa `export function sum(...)` e importa com `import { sum } from './server'`. Isso permite testar a funcao isoladamente, sem executar o servidor inteiro.