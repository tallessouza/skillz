# Code Examples: Fusos Horarios e Datas em UTC

## Gerando data UTC com JavaScript

```typescript
// O metodo toISOString() do objeto Date gera uma string ISO 8601 em UTC
const now = new Date();
const utcString = now.toISOString();
// Resultado: "2025-11-25T14:30:00.000Z"
// O Z no final confirma que e UTC (offset zero)
```

## Entendendo a data sem offset (problema)

```typescript
// SEM indicador de timezone — ambiguo
const ambiguous = "2025-11-25T14:30:00";
// Pergunta: essa data e de qual regiao?
// Sao Paulo? UTC-3 → seria 17:30 UTC
// Toquio? UTC+9 → seria 05:30 UTC
// Impossivel determinar sem contexto

// COM indicador de timezone — claro
const clear = "2025-11-25T14:30:00.000Z";
// Z = UTC, offset zero, sem ambiguidade
```

## Offsets na pratica

```typescript
// Data base em UTC
const utcDate = new Date("2025-11-25T14:30:00.000Z");

// Para Sao Paulo (UTC-3): 14:30 - 3 = 11:30
// Para Toquio (UTC+9): 14:30 + 9 = 23:30
// Para Nova York (UTC-5): 14:30 - 5 = 09:30

// O JavaScript faz isso automaticamente ao exibir:
console.log(utcDate.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
// "25/11/2025, 11:30:00"

console.log(utcDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
// "2025/11/25 23:30:00"
```

## Padrao recomendado para sistemas

```typescript
// 1. CRIAR em UTC
const createdAt = new Date().toISOString();
// "2025-11-25T14:30:00.000Z"

// 2. ARMAZENAR em UTC (enviar para API/banco)
await api.post('/events', {
  title: 'Reuniao',
  scheduledAt: createdAt, // UTC com Z
});

// 3. EXIBIR convertido para a regiao do usuario
// No Angular, o DatePipe faz isso automaticamente
// {{ event.scheduledAt | date:'dd/MM/yyyy HH:mm':'America/Sao_Paulo' }}
```

## Variacao: offset explicito vs Z

```typescript
// Ambas representam o mesmo instante:
const withZ = "2025-11-25T14:30:00.000Z";        // Z = UTC
const withOffset = "2025-11-25T14:30:00.000+00:00"; // +00:00 = UTC

// Esta ja tem offset de Sao Paulo aplicado:
const saoPaulo = "2025-11-25T11:30:00.000-03:00";
// Mesmo instante que 14:30 UTC, mas com offset explicito

// Preferir Z para armazenamento — mais limpo e universal
```

## Armadilha comum: new Date() sem toISOString()

```typescript
// CUIDADO: toString() usa timezone local do ambiente
const date = new Date();
console.log(date.toString());
// "Tue Nov 25 2025 11:30:00 GMT-0300 (Brasilia Standard Time)"
// — formato nao padrao, inclui timezone local

console.log(date.toISOString());
// "2025-11-25T14:30:00.000Z"
// — formato padrao ISO 8601, UTC, universal
```