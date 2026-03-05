# Code Examples: If Encadeado (else if / else)

## Exemplo 1: Saudacao por horario (da aula)

### Versao com ifs separados (problematica)

```javascript
let hour = 11

if (hour <= 12) {
  console.log("Bom dia")
}
if (hour > 18) {
  console.log("Boa noite")
}
if (hour > 12) {
  console.log("Boa tarde")
}
```

**Teste com hour = 11:** Output: "Bom dia" (apenas um if verdadeiro)
**Teste com hour = 13:** Output: "Boa tarde" (apenas `hour > 12` verdadeiro)
**Teste com hour = 19:** Output: "Boa noite" E "Boa tarde" (BUG — dois ifs verdadeiros)

### Versao com else if (correta)

```javascript
let hour = 19

if (hour <= 12) {
  console.log("Bom dia")
} else if (hour > 18) {
  console.log("Boa noite")
} else if (hour > 12) {
  console.log("Boa tarde")
}
```

**Teste com hour = 19:** Output: apenas "Boa noite"

### Versao com else if + else (versao final da aula)

```javascript
let hour = 19

if (hour <= 12) {
  console.log("Bom dia")
} else if (hour > 12 && hour <= 18) {
  console.log("Boa tarde")
} else {
  console.log("Boa noite")
}
```

**Teste com hour = 11:** "Bom dia"
**Teste com hour = 15:** "Boa tarde"
**Teste com hour = 19:** "Boa noite"

## Exemplo 2: Classificacao de nota (variacao)

### Ifs separados — quando faz sentido

```javascript
const score = 85

if (score >= 50) {
  console.log("Aprovado")
}
if (score >= 80) {
  console.log("Com louvor")
}
// Output: "Aprovado" E "Com louvor" — intencional!
```

### If encadeado — quando quer apenas uma classificacao

```javascript
const score = 85

if (score >= 90) {
  console.log("A")
} else if (score >= 80) {
  console.log("B")
} else if (score >= 70) {
  console.log("C")
} else if (score >= 60) {
  console.log("D")
} else {
  console.log("F")
}
// Output: apenas "B"
```

## Exemplo 3: Features independentes (ifs separados corretos)

```javascript
const user = { isPremium: true, isAdmin: false, hasNewsletter: true }

if (user.isPremium) {
  showPremiumBadge()
}
if (user.isAdmin) {
  showAdminPanel()
}
if (user.hasNewsletter) {
  showNewsletterWidget()
}
// Cada if e independente — multiplos podem ser verdadeiros
```

## Exemplo 4: Roteamento por tipo (else if correto)

```javascript
const fileType = "image"

if (fileType === "image") {
  processImage(file)
} else if (fileType === "video") {
  processVideo(file)
} else if (fileType === "document") {
  processDocument(file)
} else {
  throw new Error(`Tipo nao suportado: ${fileType}`)
}
```

## Exemplo 5: Range com && (da aula)

```javascript
const hour = 15

// Delimitando range com precisao
if (hour > 12 && hour <= 18) {
  console.log("Boa tarde")
}
// hour deve ser MAIOR que 12 E MENOR OU IGUAL a 18
```

## Armadilha: ordem errada no encadeamento

```javascript
const temperature = 45

// ERRADO — condicao generica primeiro
if (temperature > 0) {
  console.log("Acima de zero")    // 45 cai aqui
} else if (temperature > 30) {
  console.log("Muito quente")     // NUNCA alcancado para temp > 30!
}

// CORRETO — mais especifico primeiro
if (temperature > 30) {
  console.log("Muito quente")
} else if (temperature > 0) {
  console.log("Acima de zero")
} else {
  console.log("Congelando")
}
```