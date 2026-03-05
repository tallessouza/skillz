# Deep Explanation: Funções Matemáticas CSS

## Por que misturar unidades é poderoso

O instrutor demonstra que `calc()` resolve em runtime o que seria impossível em tempo de autoria. Quando você escreve `calc(20% + 4rem)`, o navegador primeiro calcula 20% do elemento pai, depois converte 4rem para pixels (baseado no font-size root), e soma. Isso permite layouts que combinam proporções relativas com espaçamentos fixos.

## Regras de operações com unidades

O instrutor enfatiza que nem toda operação faz sentido:

### Soma e subtração
- Aceitam **qualquer combinação** de unidades: `20% + 4rem + 10px` — tudo é convertido para pixels no final
- O navegador resolve cada unidade independentemente e soma os resultados

### Multiplicação
- **Exige pelo menos um operando numérico puro** (sem unidade)
- `20% * 4` = funciona (porcentagem vezes número)
- `20px * 4px` = **não funciona** — "pixels quadrados" não existe em CSS
- Analogia: é como multiplicar metros por metros — dá metros quadrados, que não é uma unidade de comprimento

### Divisão
- Mesma regra: **divisor deve ser numérico puro**
- `100px / 2` = 50px ✓
- `100px / 2px` = não funciona ✗

## min() — O menor entre N valores

O instrutor mostra que `min()` aceita múltiplos argumentos separados por vírgula. O navegador recalcula **continuamente** conforme o viewport muda. Isso é diferente de `calc()` que faz uma operação — `min()` faz uma **comparação dinâmica**.

### Exemplo do instrutor:
```css
width: min(100%, 50px, 1rem);
```
O navegador compara os três valores (convertidos para pixels) e usa o menor. Com viewport grande, 1rem (16px) será o menor. Conforme viewport encolhe, 100% pode ficar menor que 16px.

### Combinando com calc()
```css
width: min(calc(50% + 2vh), 10vh);
```
O instrutor mostra que funções podem ser aninhadas livremente.

## max() — O maior entre N valores

Funciona identicamente ao `min()`, mas retorna o maior valor. O instrutor destaca que `max()` é útil para garantir **tamanhos mínimos** na prática (parece contra-intuitivo, mas "o máximo entre X e um piso" garante que nunca fique abaixo do piso).

## clamp() — O coração da tipografia responsiva

### Os três valores obrigatórios

O instrutor explica com clareza:

1. **Mínimo** (piso): o menor valor aceitável. Ex: `1rem` — a fonte nunca fica menor que isso
2. **Ideal** (valor desejado): geralmente em `vw` para escalar com viewport. Ex: `7vw`
3. **Máximo** (teto): o maior valor aceitável. Ex: `4rem` — a fonte nunca fica maior que isso

### Comportamento demonstrado

O instrutor redimensiona o navegador ao vivo:
- Viewport diminui → fonte encolhe seguindo o ideal (7vw) → para no mínimo (1rem)
- Viewport aumenta → fonte cresce seguindo o ideal (7vw) → para no máximo (4rem)

### Equivalência lógica
```
clamp(MIN, IDEAL, MAX) === max(MIN, min(IDEAL, MAX))
```

### Escolhendo o valor ideal

O instrutor admite que é tentativa e erro: "coloca ali o que eu olhar e achar legal, é o que está valendo". Na prática, valores entre 3vw e 8vw cobrem a maioria dos casos de tipografia.

## Funções avançadas

O instrutor menciona brevemente que existem funções de:
- **Trigonometria**: `sin()`, `cos()`, `tan()` — para layouts circulares ou animações
- **Exponencial**: `pow()`, `exp()` — para escalas não-lineares
- **Raiz quadrada**: `sqrt()` — para cálculos geométricos

**Alerta de compatibilidade**: o instrutor reforça usar `caniuse.com` antes de usar qualquer função avançada, porque nem todos os navegadores suportam.

## Quando usar cada função

| Necessidade | Função |
|-------------|--------|
| Combinar unidades diferentes | `calc()` |
| Impor um teto (nunca maior que X) | `min()` |
| Impor um piso (nunca menor que X) | `max()` |
| Piso + teto + valor fluido | `clamp()` |
| Layouts circulares/rotacionais | `sin()`, `cos()` (verificar suporte) |