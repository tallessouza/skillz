# Deep Explanation: Herança com Classes

## O que é herança

Herança é o mecanismo que permite uma classe **reaproveitar** propriedades e métodos de outra classe. Em JavaScript, isso é feito com a palavra-chave `extends`.

A ideia central apresentada pelo instrutor: quando você tem entidades que compartilham características (como `Dog` e `Cat` que são ambos `Animal`), você extrai o comportamento comum para uma classe pai e faz as classes filhas herdarem.

## Como funciona por baixo

Quando você escreve `class Dog extends Animal`:
1. JavaScript configura a **prototype chain** — o prototype de `Dog` aponta para `Animal.prototype`
2. Propriedades definidas no construtor de `Animal` ficam disponíveis em instâncias de `Dog`
3. Métodos de `Animal.prototype` ficam acessíveis via prototype chain em `Dog`

## O insight do "classe vazia que funciona"

O instrutor destaca um ponto importante: `class Dog extends Animal {}` não tem **nada** dentro, mas ao instanciar `new Dog("Bilu")`, tanto `name` quanto `makeNoise()` estão disponíveis. Isso demonstra que herança não copia — ela **conecta** via prototype chain.

## Quando adicionar propriedades na classe pai

O instrutor demonstra que ao adicionar uma propriedade na classe `Animal` (como `age`), ela automaticamente aparece em **todas** as classes filhas. Isso é poderoso para centralizar, mas também perigoso se a propriedade não fizer sentido para todas as filhas.

**Regra prática:** só adicione à classe pai propriedades que façam sentido para TODAS as classes filhas.

## Herança vs Composição

O instrutor não aborda composição nesta aula, mas é importante saber:
- **Herança** = "é um" (Dog É UM Animal)
- **Composição** = "tem um" (Car TEM UM Motor)

Use herança quando a relação "é um" faz sentido semântico. Para hierarquias com mais de 2-3 níveis, considere composição.

## Edge cases

### Sobrescrita de método (override)
Se `Dog` definir seu próprio `makeNoise()`, ele sobrescreve o de `Animal`. Para chamar o original, use `super.makeNoise()`.

### Construtor na classe filha
Se a classe filha define um construtor, ela **precisa** chamar `super()` antes de usar `this`:
```javascript
class Dog extends Animal {
  constructor(name, breed) {
    super(name) // obrigatório
    this.breed = breed
  }
}
```

### instanceof
`new Dog("Bilu") instanceof Animal` retorna `true` — a relação de herança é verificável em runtime.