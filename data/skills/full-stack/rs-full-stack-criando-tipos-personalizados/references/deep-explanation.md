# Deep Explanation: Criando Tipos Personalizados

## Por que ir além dos tipos primitivos?

O instrutor começa destacando que tipos primitivos (`string`, `number`, `boolean`) são os tipos básicos — o alicerce. Porém, no desenvolvimento real de aplicações, surgem necessidades que primitivos sozinhos não resolvem.

A analogia implícita é: primitivos são como letras do alfabeto. Você precisa delas, mas para expressar ideias completas (entidades do domínio), precisa combiná-las em palavras e frases — os tipos customizados.

## O gatilho para criar um tipo customizado

O instrutor usa o exemplo de um **produto** numa aplicação. O raciocínio é:

1. A aplicação precisa representar um produto
2. Um produto tem múltiplas informações (nome, preço, descrição, disponibilidade)
3. Tipos primitivos separados não capturam a **relação** entre essas informações
4. Portanto, cria-se um tipo customizado que agrupa tudo

O ponto-chave: **o tipo customizado nasce da necessidade do domínio da aplicação**, não de uma decisão abstrata de engenharia.

## Quando NÃO criar tipo customizado

- Quando o dado é genuinamente um valor simples (um contador, uma flag isolada)
- Quando não há relação semântica entre as propriedades
- Quando o tipo já existe na biblioteca/framework que você usa

## Progressão natural

A aula posiciona tipos customizados como o próximo passo natural depois de dominar primitivos:

```
Primitivos → Tipos customizados → Composição de tipos → Generics
```

Cada nível adiciona capacidade de expressar dados mais complexos e específicos do domínio.

## Edge cases mencionados

- Cada aplicação tem suas próprias necessidades de tipo — não existe um conjunto universal de tipos customizados
- O tipo deve atender as necessidades específicas daquela aplicação, não ser genérico demais