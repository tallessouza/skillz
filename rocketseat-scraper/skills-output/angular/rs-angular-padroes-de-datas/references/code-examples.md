# Code Examples: Padrões de Datas

## Gerando ISO 8601

```typescript
// Forma direta
const isoDate = new Date().toISOString();
console.log(isoDate);
// Output: "2024-11-14T15:30:45.123Z"
```

## Gerando Unix Timestamp

```typescript
// Via instância de Date
const timestamp1 = new Date().getTime();
console.log(timestamp1);
// Output: 1731591045123 (milissegundos)

// Via método estático (sem criar objeto)
const timestamp2 = Date.now();
console.log(timestamp2);
// Output: 1731591045123 (milissegundos)
```

## Conversões entre formatos

```typescript
// ISO → Timestamp
const iso = "2024-11-14T15:30:45.123Z";
const ts = new Date(iso).getTime();
// 1731591045123

// Timestamp (ms) → ISO
const fromTs = new Date(1731591045123).toISOString();
// "2024-11-14T15:30:45.123Z"

// Timestamp em SEGUNDOS → Date (cuidado: multiplicar por 1000)
const unixSeconds = 1731591045;
const fromUnixSeconds = new Date(unixSeconds * 1000).toISOString();
// "2024-11-14T15:30:45.000Z"
```

## Comparação de datas com Timestamp

```typescript
const dateA = new Date("2024-11-14T10:00:00Z");
const dateB = new Date("2024-11-14T15:00:00Z");

// Comparação simples
if (dateA.getTime() > dateB.getTime()) {
  console.log("A é depois de B");
} else {
  console.log("B é depois de A");
}

// Diferença em milissegundos
const diffMs = dateB.getTime() - dateA.getTime();
const diffHours = diffMs / (1000 * 60 * 60);
console.log(`Diferença: ${diffHours} horas`); // 5 horas
```

## Uso em Angular (contexto do curso)

```typescript
// No componente
@Component({...})
export class EventComponent {
  // Armazene como ISO 8601
  eventDate = "2024-11-14T15:30:45.123Z";

  // Para comparações, converta
  isEventInPast(): boolean {
    return new Date(this.eventDate).getTime() < Date.now();
  }
}
```

```html
<!-- No template, use o DatePipe com a string ISO -->
<p>{{ eventDate | date:'dd/MM/yyyy HH:mm' }}</p>
```

## Identificando o formato recebido

```typescript
function identifyDateFormat(value: string | number): 'iso' | 'unix-seconds' | 'unix-ms' | 'unknown' {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return 'iso';
  }
  if (typeof value === 'number') {
    const digits = value.toString().length;
    if (digits === 10) return 'unix-seconds';
    if (digits === 13) return 'unix-ms';
  }
  return 'unknown';
}
```