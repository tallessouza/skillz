# Code Examples: Shallow e Deep Copy

## Exemplo 1: O problema (shallow copy com spread)

Direto da aula — criando um curso e tentando copiar com spread:

```javascript
const htmlCourse = {
  course: "HTML",
  students: [
    { name: "Rodrigo", email: "rodrigo@email.com" }
  ]
}

// Shallow copy — students e uma REFERENCIA, nao uma copia
const jsCourse = { ...htmlCourse, course: "JavaScript" }

// Adicionando aluno no jsCourse
jsCourse.students.push({ name: "João", email: "joao@email.com" })

console.log(htmlCourse)
// { course: "HTML", students: [Rodrigo, João] } ← João apareceu aqui tambem!

console.log(jsCourse)
// { course: "JavaScript", students: [Rodrigo, João] }
```

**O que aconteceu:** `students` e um array (objeto aninhado). O spread copiou a **referencia** do array, nao o array em si. Ambos os objetos apontam para o mesmo array na memoria.

## Exemplo 2: Deep copy inline (spread no students)

```javascript
const htmlCourse = {
  course: "HTML",
  students: [
    { name: "Rodrigo", email: "rodrigo@email.com" }
  ]
}

const jsCourse = {
  ...htmlCourse,
  course: "JavaScript",
  students: [
    ...htmlCourse.students,
    { name: "João", email: "joao@email.com" }
  ]
}

console.log(htmlCourse.students.length) // 1 — so Rodrigo
console.log(jsCourse.students.length)   // 2 — Rodrigo + João
```

**Por que funciona:** ao criar `students: [...]` com um novo array literal e usar spread para despejar os items existentes, criamos um **novo array**. A referencia e diferente.

## Exemplo 3: Deep copy com push separado

```javascript
const htmlCourse = {
  course: "HTML",
  students: [
    { name: "Rodrigo", email: "rodrigo@email.com" }
  ]
}

const jsCourse = {
  ...htmlCourse,
  course: "JavaScript",
  students: [...htmlCourse.students]  // novo array, copia dos elementos
}

jsCourse.students.push({ name: "Maria", email: "maria@email.com" })

console.log(htmlCourse.students.length) // 1 — so Rodrigo
console.log(jsCourse.students.length)   // 2 — Rodrigo + Maria
```

**Diferenca:** aqui o novo aluno e adicionado depois com `push`, em vez de inline. O resultado e identico porque `students` ja e um novo array.

## Exemplo 4: Deep copy com atribuicao direta

```javascript
const htmlCourse = {
  course: "HTML",
  students: [
    { name: "Rodrigo", email: "rodrigo@email.com" }
  ]
}

const jsCourse = { ...htmlCourse, course: "JavaScript" }
// Neste ponto, jsCourse.students ainda e referencia!

// Sobrescreve a referencia com um novo array
jsCourse.students = [
  ...htmlCourse.students,
  { name: "João", email: "joao@email.com" }
]

console.log(htmlCourse.students.length) // 1
console.log(jsCourse.students.length)   // 2
```

**Quando usar:** quando voce ja tem o objeto criado e quer substituir a propriedade aninhada depois.

## Exemplo 5: Variacoes para diferentes estruturas

### Array de primitivos

```javascript
const original = { tags: ["html", "css", "js"] }
const copy = { ...original, tags: [...original.tags] }

copy.tags.push("react")
console.log(original.tags) // ["html", "css", "js"] — intacto
```

### Objeto aninhado (nao array)

```javascript
const user = {
  name: "Rodrigo",
  address: { city: "São Paulo", state: "SP" }
}

// Deep copy do objeto aninhado
const userCopy = {
  ...user,
  address: { ...user.address }
}

userCopy.address.city = "Rio de Janeiro"
console.log(user.address.city) // "São Paulo" — intacto
```

### Multiplos niveis

```javascript
const school = {
  name: "Rocketseat",
  courses: [
    {
      name: "HTML",
      modules: [
        { title: "Intro", lessons: ["O que é HTML"] }
      ]
    }
  ]
}

// Deep copy manual completo
const schoolCopy = {
  ...school,
  courses: school.courses.map(course => ({
    ...course,
    modules: course.modules.map(mod => ({
      ...mod,
      lessons: [...mod.lessons]
    }))
  }))
}
```

### Usando structuredClone (moderno)

```javascript
// Resolve qualquer profundidade automaticamente
const schoolCopy = structuredClone(school)
schoolCopy.courses[0].modules[0].lessons.push("Tags semânticas")
console.log(school.courses[0].modules[0].lessons.length) // 1 — intacto
```

## Resumo das 3 formas de deep copy da aula

| Forma | Codigo | Quando usar |
|-------|--------|-------------|
| Inline com spread | `students: [...orig.students, newItem]` | Quando ja sabe o que adicionar |
| Spread + push | `students: [...orig.students]` depois `push()` | Quando adiciona condicionalmente |
| Atribuicao direta | `obj.students = [...orig.students]` | Quando objeto ja existe |