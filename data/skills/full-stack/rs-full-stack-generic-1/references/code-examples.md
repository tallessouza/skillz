# Code Examples: TypeScript Generics

## Exemplo 1: Evolucao completa (da aula)

### Passo 1 — Funcao com tipo fixo (sem flexibilidade)

```typescript
function useState() {
  let state: number;

  function get() {
    return state;
  }

  function set(newValue: number) {
    state = newValue;
  }

  return { get, set };
}

const s = useState();
s.set(123);      // OK
s.set("texto");  // ERRO — so aceita number
```

### Passo 2 — Union (flexivel demais)

```typescript
function useState() {
  let state: number | string;

  function get() {
    return state;
  }

  function set(newValue: number | string) {
    state = newValue;
  }

  return { get, set };
}

const s = useState();
s.set("texto");  // OK
s.set(123);      // OK
s.set("outro");  // OK — pode intercalar livremente
```

### Passo 3 — Generic basico (sem constraint)

```typescript
function useState<T>() {
  let state: T;

  function get() {
    return state;
  }

  function set(newValue: T) {
    state = newValue;
  }

  return { get, set };
}

const s = useState(); // T = unknown — sem garantia
```

### Passo 4 — Generic com constraint

```typescript
function useState<T extends number | string>() {
  let state: T;

  function get() {
    return state;
  }

  function set(newValue: T) {
    state = newValue;
  }

  return { get, set };
}

const s = useState<string>();
s.set("Rodrigo"); // OK
s.set(123);        // ERRO — tipo travado como string
```

### Passo 5 — Generic com constraint E default (versao final)

```typescript
function useState<T extends number | string = string>() {
  let state: T;

  function get() {
    return state;
  }

  function set(newValue: T) {
    state = newValue;
  }

  return { get, set };
}

// Com tipo explicito
let newState = useState<string>();
newState.get();
newState.set("Rodrigo"); // OK
newState.set(123);        // ERRO
newState.set("Amanda");   // OK

// Sem tipo — assume default string
let defaultState = useState();
defaultState.set("texto"); // OK
defaultState.set(123);     // ERRO — default e string
```

## Exemplo 2: Generic em funcao utilitaria

```typescript
function wrapInArray<T extends string | number>(value: T): T[] {
  return [value];
}

const strings = wrapInArray<string>("hello"); // string[]
const numbers = wrapInArray<number>(42);       // number[]
```

## Exemplo 3: Multiplos generics

```typescript
function createPair<K extends string, V extends number | boolean>(
  key: K,
  value: V
): { key: K; value: V } {
  return { key, value };
}

const pair = createPair("age", 30);
// tipo inferido: { key: "age"; value: number }
```

## Exemplo 4: Generic com objetos

```typescript
function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Rodrigo", age: 25 };
const name = getProperty(user, "name");  // string
const age = getProperty(user, "age");    // number
```

## Exemplo 5: Comparacao direta — Generic vs Union

```typescript
// UNION: permite intercalar
function setValueUnion(state: { value: number | string }) {
  state.value = "texto";
  state.value = 123;     // OK — union permite
  state.value = "outro"; // OK
}

// GENERIC: trava na declaracao
function setValueGeneric<T extends number | string>(initial: T) {
  let value: T = initial;
  // A partir daqui, value so aceita T
  // Se T = string, so string
  // Se T = number, so number
  return value;
}

const s = setValueGeneric("texto"); // T inferido como string
const n = setValueGeneric(42);       // T inferido como number
```

## Exemplo 6: Uso real — React useState (contexto mencionado pelo instrutor)

```typescript
// Assim que o React implementa useState internamente (simplificado)
function useState<S>(initialState: S): [S, (newState: S) => void] {
  let state = initialState;

  function setState(newState: S) {
    state = newState;
    // trigger re-render...
  }

  return [state, setState];
}

// Uso
const [name, setName] = useState<string>(""); 
setName("Rodrigo"); // OK
setName(123);        // ERRO — generic travou como string
```

## Exemplo 7: Uso real — Axios (contexto mencionado pelo instrutor)

```typescript
// Axios usa generic para tipar a resposta
interface User {
  id: number;
  name: string;
}

// O generic <User[]> diz que response.data e User[]
const response = await axios.get<User[]>("/api/users");
response.data.forEach(user => {
  console.log(user.name); // tipado automaticamente
});
```