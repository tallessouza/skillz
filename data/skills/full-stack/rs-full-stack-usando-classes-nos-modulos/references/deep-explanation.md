# Deep Explanation: Classes em Módulos JavaScript

## Por que classes em módulos?

O instrutor (Rodrigo) apresenta classes como uma **alternativa organizacional** às funções exportadas individualmente. A motivação central é: quando você tem múltiplas funções que pertencem ao mesmo domínio (ex: operações matemáticas), a classe funciona como um **agrupador natural**.

### A analogia implícita

Funções exportadas individualmente são como ferramentas soltas numa gaveta — funcionam, mas você precisa saber o nome de cada uma. Uma classe é como uma caixa de ferramentas rotulada — você pega a caixa (instancia) e sabe que tudo relacionado está dentro.

## O que significa "refatorar"

O instrutor faz questão de explicar o termo: **refatorar = modificar o código sem mudar o comportamento**. Ele transforma funções soltas em métodos de classe, mantendo a mesma funcionalidade. Isso é importante porque mostra que a decisão entre funções e classes é **organizacional**, não funcional.

## Por que `function` desaparece dentro da classe

Na sintaxe de classe do JavaScript, métodos são declarados sem a palavra `function`. O instrutor explica que "a própria sintaxe já diz para a classe que isso é um método". Tecnicamente, o parser do JS reconhece `identifier(params) { body }` dentro de um `class {}` como declaração de método.

```javascript
// Fora da classe: precisa de function
function sum(a, b) { return a + b }

// Dentro da classe: a posição já define que é método
class Calc {
  sum(a, b) { return a + b }  // sem function
}
```

## Instanciação: por que é necessária

O instrutor enfatiza: `const calc = new Calc()`. Isso cria uma **instância** da classe. Sem isso, você não consegue chamar os métodos. A classe é o molde, a instância é o objeto usável.

## Propriedades: tudo que está dentro da classe é acessível

O instrutor demonstra que além de métodos, você pode ter propriedades:

```javascript
export class Calc {
  name = 'Rodrigo'
  // ...métodos
}
```

E acessa com `calc.name`. O ponto central: **tudo que você colocar dentro da classe, você consegue utilizar como módulo**. A classe é um container completo.

## Quando usar cada abordagem

O instrutor apresenta as duas como opções válidas:
- **Funções exportadas**: quando são independentes entre si
- **Classes**: quando funções compartilham um domínio ou estado

Ele diz gostar da sintaxe de classe porque "é uma forma de você ter dentro da classe todos os métodos que ela compartilha" — o agrupamento é o valor.

## Acesso com ponto (dot notation)

O instrutor reforça: `calc.sum()`, `calc.multiply()`. O ponto é o operador de acesso a membros. Quando você importa funções soltas, chama diretamente `sum()`. Quando usa classe, o namespace da instância organiza tudo sob `calc.*`.

## Edge cases e nuances

### Métodos estáticos (não abordado na aula, mas relevante)
Se você não precisa de estado, pode usar `static`:
```javascript
class Calc {
  static sum(a, b) { return a + b }
}
Calc.sum(2, 3)  // sem instanciar
```
O instrutor não menciona isso — foca no padrão com instanciação.

### Export default vs named export
O instrutor usa `export class Calc` (named export). Poderia usar `export default class Calc`, mas named exports são mais explícitos e permitem autocomplete melhor.