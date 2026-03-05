# Code Examples: Definindo Data e Hora Específica em JavaScript

## Exemplo 1: Apenas data com construtor numérico

```javascript
// Define 3 de julho de 2024
// Mês 6 = julho (0-indexado: jan=0, fev=1, ..., jul=6, ..., dez=11)
console.log(new Date(2024, 6, 3))
// Wed Jul 03 2024 00:00:00 GMT-0300
```

### Demonstração do overflow de mês:
```javascript
console.log(new Date(2024, 11, 3))  // Dezembro 2024 ✓
console.log(new Date(2024, 12, 3))  // Janeiro 2025! (overflow)
console.log(new Date(2024, 7, 3))   // Agosto 2024 (não julho!)
```

## Exemplo 2: Data e hora com construtor numérico

```javascript
// Define 3 de julho de 2024 às 14:30:00
// Argumentos: ano, mês(0-index), dia, hora, minuto, segundo
console.log(new Date(2024, 6, 3, 14, 30, 0))
// Wed Jul 03 2024 14:30:00 GMT-0300
```

### Variações:
```javascript
// Apenas hora, sem minutos/segundos (defaultam para 0)
new Date(2024, 6, 3, 14)        // 14:00:00

// Com segundos
new Date(2024, 6, 3, 14, 30, 45) // 14:30:45

// Com milissegundos
new Date(2024, 6, 3, 14, 30, 45, 500) // 14:30:45.500
```

## Exemplo 3: String ISO com T separator

```javascript
// Mês 07 = julho (1-indexado no formato string!)
console.log(new Date("2024-07-03T14:30:00"))
// Wed Jul 03 2024 14:30:00 GMT-0300
```

### Variações:
```javascript
// Apenas data (sem hora) — interpretado como UTC
new Date("2024-07-03")           // Cuidado: pode dar dia anterior em UTC-

// Com timezone explícito
new Date("2024-07-03T14:30:00Z")        // UTC
new Date("2024-07-03T14:30:00-03:00")   // Brasília

// Com milissegundos
new Date("2024-07-03T14:30:00.000Z")
```

## Exemplo 4: String legível

```javascript
// Nome do mês em inglês, formato americano
console.log(new Date("July 3, 2024 14:30:00"))
// Wed Jul 03 2024 14:30:00 GMT-0300
```

### Variações demonstradas pelo instrutor:
```javascript
// Mudando ano e hora
console.log(new Date("July 3, 2032 13:30:00"))
// Fri Jul 03 2032 13:30:00

// Com segundos
console.log(new Date("July 3, 2032 13:30:33"))
// Fri Jul 03 2032 13:30:33
```

## Comparação direta dos 4 métodos (mesma data)

```javascript
// Todos representam: 3 de julho de 2024, 14:30:00

// 1. Construtor numérico (mês 0-indexado)
const d1 = new Date(2024, 6, 3, 14, 30, 0)

// 2. String ISO (mês 1-indexado, T separa data/hora)
const d2 = new Date("2024-07-03T14:30:00")

// 3. String legível (mês por nome)
const d3 = new Date("July 3, 2024 14:30:00")

// 4. Data atual (sem argumentos)
const now = new Date()  // data e hora do momento da execução
```

## Tabela de referência rápida: meses

| Mês | Construtor numérico | String ISO | String legível |
|-----|---------------------|------------|----------------|
| Janeiro | 0 | 01 | January |
| Fevereiro | 1 | 02 | February |
| Março | 2 | 03 | March |
| Abril | 3 | 04 | April |
| Maio | 4 | 05 | May |
| Junho | 5 | 06 | June |
| Julho | 6 | 07 | July |
| Agosto | 7 | 08 | August |
| Setembro | 8 | 09 | September |
| Outubro | 9 | 10 | October |
| Novembro | 10 | 11 | November |
| Dezembro | 11 | 12 | December |