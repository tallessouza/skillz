# Deep Explanation: Métodos para Trabalhar com Data e Hora

## Por que zero-indexed?

O JavaScript herdou a convenção de zero-indexing para meses e dias da semana da linguagem C (via Java). A função `struct tm` do C define `tm_mon` como 0-11 e `tm_wday` como 0-6. Quando Brendan Eich criou o Date do JS baseado no `java.util.Date`, essa convenção veio junto.

### A exceção: getDate()

`getDate()` retorna 1-31, não 0-30. Isso porque ninguém se refere ao primeiro dia do mês como "dia 0". É a única exceção entre os getters — e a mais confusa, porque quebra o padrão dos outros métodos.

## Mapa completo dos getters

| Método | Retorno | Range | Zero-indexed? |
|--------|---------|-------|---------------|
| `getFullYear()` | Ano com 4 dígitos | 1970+ | N/A |
| `getMonth()` | Mês | 0-11 | Sim |
| `getDate()` | Dia do mês | 1-31 | **Não** |
| `getDay()` | Dia da semana | 0-6 | Sim (dom=0) |
| `getHours()` | Hora | 0-23 | Sim |
| `getMinutes()` | Minutos | 0-59 | Sim |
| `getSeconds()` | Segundos | 0-59 | Sim |
| `getMilliseconds()` | Milissegundos | 0-999 | Sim |
| `getTime()` | Timestamp Unix | ms desde 1970 | N/A |

## Analogia do instrutor: "Contar do zero"

O instrutor enfatiza que o JS "sempre usa como referência o início como sendo o 0". Isso é uma regra mental útil:
- Dia da semana: domingo = 0, segunda = 1, ..., sábado = 6
- Mês: janeiro = 0, fevereiro = 1, ..., dezembro = 11
- **Exceção explícita:** dia do mês começa em 1

## Edge cases importantes

### getDay() e localização
No Brasil e EUA, domingo é o primeiro dia da semana. Em muitos países europeus, segunda-feira é o primeiro. `getDay()` SEMPRE retorna 0 para domingo, independente do locale. Se precisar de segunda=0, use `(date.getDay() + 6) % 7`.

### getDate() no final do mês
`new Date(2024, 1, 30)` (30 de fevereiro) — JS não dá erro, faz rollover para março. Isso pode causar bugs silenciosos ao manipular datas.

### getMonth() ao construir strings
O bug mais comum em JS com datas: esquecer o +1 ao montar strings como `${year}-${month}-${day}`. Julho vira "06" ao invés de "07".

## getYear() vs getFullYear()

`getYear()` é deprecated. Retorna anos desde 1900 (ex: 2024 retorna 124). Nunca use. `getFullYear()` retorna o ano completo com 4 dígitos.