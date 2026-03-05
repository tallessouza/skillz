# Deep Explanation: Sobrescrita de Métodos

## Por que sobrescrever métodos?

Quando uma classe filha herda de uma classe pai, todos os métodos do pai ficam disponíveis na filha. Isso é herança. Porém, o comportamento genérico do pai raramente é o que a classe filha precisa.

O instrutor usa a analogia Animal → Dog/Cat: ambos são animais, mas um cachorro late e um gato mia. Se você não sobrescreve `makeNoise()`, tanto Dog quanto Cat exibem "algum som genérico do animal" — completamente inútil.

## Como JavaScript resolve métodos (cadeia de protótipos)

Quando você chama `dog.makeNoise()`:

1. JavaScript procura `makeNoise` na instância `dog` → não encontra
2. Procura na classe `Dog.prototype` → se encontra, executa
3. Se não encontra, sobe para `Animal.prototype` → executa de lá

Quando você sobrescreve, está colocando o método no passo 2, então JavaScript nunca chega ao passo 3.

## Métodos específicos vs compartilhados

O instrutor destaca um ponto importante: você pode ter dois tipos de métodos em uma hierarquia:

1. **Métodos compartilhados (na classe pai):** Todas as filhas herdam. Ex: `makeNoise()` como contrato — todo animal faz barulho.
2. **Métodos específicos (na classe filha):** Apenas aquela classe tem. Ex: `fetch()` em Dog — gatos não buscam objetos.

Se você chamar `cat.fetch()`, dará erro, porque `fetch` não existe em Cat nem em Animal. Isso é intencional — nem todo comportamento deve ser compartilhado.

## Quando usar `super`

O instrutor não cobre `super.metodo()` nesta aula, mas é a extensão natural: quando a filha quer ADICIONAR ao comportamento do pai (não substituir completamente):

```javascript
class Dog extends Animal {
  makeNoise() {
    super.makeNoise() // executa o do pai primeiro
    console.log("Woof! Woof!") // adiciona o específico
  }
}
```

## Erro comum mostrado na aula

O instrutor demonstra ao vivo: tentou chamar `dog.run()` e deu erro porque `run()` não existia nem em Dog nem em Animal. Isso reforça que herança não é mágica — só herda o que existe na classe pai.