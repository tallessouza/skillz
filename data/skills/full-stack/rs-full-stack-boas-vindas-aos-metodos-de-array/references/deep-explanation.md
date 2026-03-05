# Deep Explanation: Métodos de Array

## Por que métodos de array importam

O instrutor posiciona métodos de array como ferramentas fundamentais que todo desenvolvedor precisa conhecer. A ênfase está nas **possibilidades**: não é apenas sobre iterar, mas sobre ter o vocabulário certo para cada operação com dados.

## Três categorias de operação

### 1. Percorrer (iteração sem transformação)
- `forEach`: executa side-effect para cada item
- Caso de uso: logging, disparar eventos, atualizar DOM

### 2. Manipular (transformação)
- `map`: transforma cada item, mantém quantidade
- `filter`: seleciona subset por condição
- `flatMap`: transforma e achata em uma operação

### 3. Retornar novo valor (redução)
- `reduce`: acumula array em qualquer formato
- `find` / `findIndex`: busca item específico
- `some` / `every`: verifica condições booleanas

## Modelo mental do instrutor

O instrutor apresenta os métodos como "ferramentas separadas" — cada um com propósito distinto. A abordagem é ensinar um por um, respeitando a especificidade de cada método ao invés de tratá-los como variações do mesmo conceito.

## Princípio fundamental

**Escolha pelo que você QUER FAZER, não pelo que você SABE USAR.** Desenvolvedores iniciantes usam `forEach` para tudo. Desenvolvedores experientes escolhem o método que expressa a intenção: `filter` para filtrar, `map` para transformar, `find` para buscar.