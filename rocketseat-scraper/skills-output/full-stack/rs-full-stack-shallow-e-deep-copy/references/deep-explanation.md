# Deep Explanation: Shallow e Deep Copy

## Por que isso acontece — o modelo mental

Em JavaScript, variaveis que contem valores primitivos (string, number, boolean, null, undefined) armazenam o **valor diretamente**. Ja variaveis que contem objetos, arrays ou funcoes armazenam uma **referencia** (um ponteiro para o local na memoria onde o dado esta).

Quando voce usa spread (`...`), ele itera sobre as propriedades do primeiro nivel e copia seus valores. Se o valor e primitivo, a copia e independente. Se o valor e uma referencia (array, objeto), o que e copiado e **a referencia em si**, nao o conteudo apontado por ela.

### Analogia do instrutor

Imagine que o objeto e uma casa. As propriedades primitivas sao moveis dentro da casa — ao copiar, voce leva os moveis. Mas um array aninhado e como um **endereco para um deposito externo**. O spread copia o endereco, nao o deposito. Entao as duas casas (original e copia) apontam para o mesmo deposito. Se voce coloca algo no deposito, aparece nas duas casas.

## O mecanismo do spread em detalhe

```javascript
const original = {
  course: "HTML",           // primitivo: copiado por valor
  students: [{ name: "Rodrigo" }]  // referencia: copiado o ponteiro
}

const copy = { ...original }

// copy.course === "HTML"  (valor independente)
// copy.students === original.students  (MESMA referencia!)
```

Testar isso e simples:

```javascript
console.log(copy.students === original.students) // true — mesma referencia
```

Apos deep copy:

```javascript
const deepCopy = { ...original, students: [...original.students] }
console.log(deepCopy.students === original.students) // false — arrays diferentes
```

## Niveis de profundidade

O spread resolve **um nivel**. Se voce tem objetos dentro de arrays dentro de objetos, precisa fazer spread em cada nivel:

```javascript
// 3 niveis de aninhamento
const school = {
  name: "Rocketseat",
  courses: [
    {
      name: "HTML",
      students: [{ name: "Rodrigo" }]
    }
  ]
}

// Deep copy manual (trabalhoso para 3+ niveis)
const schoolCopy = {
  ...school,
  courses: school.courses.map(course => ({
    ...course,
    students: [...course.students]
  }))
}
```

Para casos com muitos niveis, `structuredClone()` (disponivel em browsers modernos e Node 17+) resolve automaticamente:

```javascript
const schoolCopy = structuredClone(school)
```

## Quando shallow copy e suficiente

O ponto-chave do instrutor: **para propriedades de valores primitivos (string, number, etc.), shallow copy e suficiente**. O problema so aparece quando ha objetos complexos aninhados (arrays, objetos dentro de objetos).

Antes de decidir entre shallow e deep copy, inspecione a estrutura do objeto:
- Todas as propriedades sao primitivas? → Shallow copy
- Alguma propriedade e array ou objeto? → Deep copy nesse nivel
- Estrutura profundamente aninhada (3+)? → `structuredClone()` ou biblioteca

## Erro classico em React

Este e o cenario mais comum onde este conceito causa bugs:

```javascript
// Estado com array aninhado
const [courses, setCourses] = useState([
  { name: "HTML", students: ["Rodrigo"] }
])

// ERRADO: muta o estado original
const updated = [...courses]
updated[0].students.push("João") // muta o objeto original!
setCourses(updated)

// CORRETO: deep copy do item modificado
setCourses(courses.map((course, i) =>
  i === 0
    ? { ...course, students: [...course.students, "João"] }
    : course
))
```

## Object.assign vs Spread

`Object.assign({}, obj)` faz exatamente a mesma coisa que `{...obj}` — shallow copy. Nenhum dos dois resolve o problema de referencias aninhadas. A escolha entre eles e puramente estetica.