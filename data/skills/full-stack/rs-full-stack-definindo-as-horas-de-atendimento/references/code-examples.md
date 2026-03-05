# Code Examples: Centralizar Constantes de Negocio

## Exemplo original da aula

```javascript
// src/utils/opening-hours.js
export const openingHours = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]
```

## Variacao: Com intervalo de almoco

```javascript
export const openingHours = [
  "09:00",
  "10:00",
  "11:00",
  // Almoco: 12:00 - 13:00
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
]
```

## Variacao: Horarios com meia hora

```javascript
export const openingHours = [
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00",
]
```

## Consumo em componente React

```javascript
import { openingHours } from "../utils/opening-hours"

function HourSelect({ selectedDate, bookedHours, onSelect }) {
  const availableHours = openingHours.filter(
    (hour) => !bookedHours.includes(hour)
  )

  return (
    <div className="hour-grid">
      {availableHours.map((hour) => (
        <button key={hour} onClick={() => onSelect(hour)}>
          {hour}
        </button>
      ))}
    </div>
  )
}
```

## Consumo em validacao antes de enviar para API

```javascript
import { openingHours } from "../utils/opening-hours"

function validateAppointment(date, hour) {
  if (!openingHours.includes(hour)) {
    throw new Error(`Horario ${hour} nao disponivel`)
  }
  // ... continuar validacao
}
```

## Outros exemplos do mesmo padrao (diferentes dominios)

### Categorias de servico

```javascript
// src/utils/service-categories.js
export const serviceCategories = [
  "Corte",
  "Barba",
  "Coloracao",
  "Tratamento",
  "Manicure",
]
```

### Dias da semana disponiveis

```javascript
// src/utils/working-days.js
export const workingDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]
```

### Duracoes de servico

```javascript
// src/utils/service-durations.js
export const serviceDurations = [30, 45, 60, 90, 120] // em minutos
```