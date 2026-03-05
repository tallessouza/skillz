# Code Examples: Datas em UTC no Desenvolvimento de Software

## 1. Gerando data em UTC

```typescript
const purchasedAt = new Date().toISOString()
// Resultado: "2024-03-15T10:20:40.000Z"
// O "Z" indica UTC — sem fuso horário, sem offset
```

## 2. Capturando a região IANA do navegador

```typescript
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
// Resultado: "America/Sao_Paulo"
```

Essa API pega a região configurada no sistema/navegador do usuário.

## 3. Capturando o idioma do navegador

```typescript
const userLocale = navigator.language
// Resultado: "pt-BR"
```

## 4. Calculando o offset em minutos e convertendo para string

```typescript
const offsetInMinutes = new Date().getTimezoneOffset()
// getTimezoneOffset() retorna em minutos com sinal invertido
// Para America/Sao_Paulo: retorna 180 (que significa -03:00)

// Corrigir o sinal
const sign = offsetInMinutes > 0 ? '-' : '+'

// Calcular horas e minutos
const absoluteOffset = Math.abs(offsetInMinutes)
const hours = Math.floor(absoluteOffset / 60)
const minutes = absoluteOffset % 60

// Formatar com zeros à esquerda
const hoursStr = String(hours).padStart(2, '0')
const minutesStr = String(minutes).padStart(2, '0')

// String final
const offsetString = `${sign}${hoursStr}:${minutesStr}`
// Resultado: "-03:00"
```

## 5. Extraindo offset a partir de uma região IANA

Cenário: você tem apenas `"Asia/Tokyo"` e quer descobrir o offset.

```typescript
const date = new Date('2024-03-15T10:20:40.000Z')
const region = 'Asia/Tokyo'

// Criar formatador com timeZoneName longo
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: region,
  timeZoneName: 'longOffset'
})

// Extrair as partes formatadas
const parts = formatter.formatToParts(date)

// Encontrar a parte do timeZoneName
const timeZonePart = parts.find(part => part.type === 'timeZoneName')
// timeZonePart.value = "GMT+9"

// Remover "GMT" para obter apenas o offset
const offsetClean = timeZonePart.value.replace('GMT', '')
// Resultado: "+9"
```

Esse offset pode ser passado para o `DatePipe` do Angular como parâmetro de timezone.

## 6. Cenário completo: salvando uma compra com todos os metadados

```typescript
interface PurchaseRecord {
  id: string
  purchasedAt: string    // UTC ISO string
  userTimezone: string   // IANA timezone
  userOffset: string     // Offset string
  userLocale: string     // Idioma do navegador
}

function createPurchaseRecord(purchaseId: string): PurchaseRecord {
  const now = new Date()

  return {
    id: purchaseId,
    purchasedAt: now.toISOString(),
    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userOffset: getOffsetString(now),
    userLocale: navigator.language
  }
}

// Resultado exemplo:
// {
//   id: "purchase-123",
//   purchasedAt: "2024-03-15T17:30:00.000Z",
//   userTimezone: "America/Sao_Paulo",
//   userOffset: "-03:00",
//   userLocale: "pt-BR"
// }
```

## 7. Convertendo UTC para fuso do Japão (o caso do e-commerce)

```typescript
// Data salva em UTC
const utcDate = new Date('2024-03-15T17:30:00.000Z')

// Converter para exibição no fuso do Japão (+09:00)
const japanFormatted = utcDate.toLocaleString('ja-JP', {
  timeZone: 'Asia/Tokyo'
})
// Resultado: "2024/3/16 2:30:00" (note que mudou o dia também)

// Converter para exibição no fuso do Brasil (-03:00)
const brazilFormatted = utcDate.toLocaleString('pt-BR', {
  timeZone: 'America/Sao_Paulo'
})
// Resultado: "15/03/2024 14:30:00"
```

Esse é exatamente o cenário do instrutor: a equipe antifraude no Japão vê que a compra às 14:30 no Brasil corresponde às 02:30 do dia seguinte no Japão.