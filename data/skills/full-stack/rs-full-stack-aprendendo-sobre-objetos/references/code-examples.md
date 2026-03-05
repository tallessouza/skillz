# Code Examples: Modelagem de Objetos em JavaScript

## Exemplo 1: Objeto carro (so propriedades)

```javascript
// Representando um carro com suas caracteristicas
const carro = {
  modelo: "Civic",
  numeroDePortas: 4,
  anoDeFabricacao: 2024,
  cor: "prata"
}

// Acessando propriedades
console.log(carro.modelo)          // "Civic"
console.log(carro.numeroDePortas)  // 4
```

## Exemplo 2: Objeto carro (propriedades + metodos)

```javascript
const carro = {
  modelo: "Civic",
  numeroDePortas: 4,
  anoDeFabricacao: 2024,
  cor: "prata",

  // Metodos = comportamentos do carro
  ligar() {
    return "Carro ligado"
  },
  desligar() {
    return "Carro desligado"
  },
  acelerar() {
    return "Acelerando..."
  },
  frear() {
    return "Freando..."
  }
}

console.log(carro.ligar())     // "Carro ligado"
console.log(carro.acelerar())  // "Acelerando..."
```

## Exemplo 3: Mesma estrutura, valores diferentes (locadora)

```javascript
// Todos os carros tem as mesmas propriedades, valores diferentes
const carro1 = {
  modelo: "Civic",
  numeroDePortas: 4,
  anoDeFabricacao: 2024,
  cor: "prata"
}

const carro2 = {
  modelo: "Onix",
  numeroDePortas: 4,
  anoDeFabricacao: 2023,
  cor: "preto"
}

const carro3 = {
  modelo: "Uno",
  numeroDePortas: 2,
  anoDeFabricacao: 2020,
  cor: "vermelho"
}
```

## Exemplo 4: Abstracao concreta vs conceitual

```javascript
// Concreta — entidade palpavel
const pessoa = {
  nome: "Joao",
  idade: 28,
  profissao: "Desenvolvedor"
}

// Nao concreta — entidade conceitual
const departamento = {
  nome: "Engenharia",
  responsavel: "Maria",
  quantidadeFuncionarios: 42
}

// Nao concreta — entidade conceitual
const pedido = {
  numero: 12345,
  status: "em_andamento",
  valorTotalEmCentavos: 15990
}
```

## Exemplo 5: Objeto so com propriedades (sem metodos)

```javascript
// Perfeitamente valido — nem todo objeto precisa de metodos
const produto = {
  nome: "Teclado Mecanico",
  precoEmCentavos: 34900,
  categoria: "Perifericos",
  emEstoque: true
}
```

## Exemplo 6: Objeto com metodos que usam propriedades

```javascript
const conta = {
  titular: "Ana",
  saldoEmCentavos: 100000,

  depositar(valorEmCentavos) {
    this.saldoEmCentavos += valorEmCentavos
    return `Deposito de R$${(valorEmCentavos / 100).toFixed(2)} realizado`
  },

  sacar(valorEmCentavos) {
    if (valorEmCentavos > this.saldoEmCentavos) {
      return "Saldo insuficiente"
    }
    this.saldoEmCentavos -= valorEmCentavos
    return `Saque de R$${(valorEmCentavos / 100).toFixed(2)} realizado`
  },

  consultarSaldo() {
    return `Saldo: R$${(this.saldoEmCentavos / 100).toFixed(2)}`
  }
}
```