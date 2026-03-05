# Deep Explanation: Componente de Botao

## Por que reset tag-agnostico?

O instrutor demonstra que um botao pode ser `<a>`, `<button>` ou `<span>`. Cada tag tem estilos default diferentes — `<button>` tem borda e background, `<a>` tem underline. Ao criar uma classe `.btn` que zera tudo (border: none, background: transparent), o componente funciona identicamente independente da tag HTML.

A frase-chave: "eu nunca sei se vai ser um botao, se vai ser um A" — isso revela a mentalidade de componente CSS puro, desacoplado de semantica HTML.

## Estrategia de composicao de classes

O instrutor separa em tres camadas:
1. **Base** (`.btn`) — reset + layout (flex, align, justify, fit-content, border-radius, cursor)
2. **Estilo** (`.btn-primary`) — cores via custom properties
3. **Tamanho** (`.btn-small`, `.btn-md`, `.btn-large`) — font-size + padding

Isso permite combinacoes livres: `btn btn-primary btn-large`, `btn btn-secondary btn-small`, etc.

## Custom properties locais para hover (insight principal)

Em vez de repetir propriedades CSS inteiras no `:hover`, o instrutor cria variaveis intermediarias:

```css
.btn-primary {
  --btn-bgcolor: var(--text-color-primary);
  --btn-color: var(--bg-color);
  background: var(--btn-bgcolor);
  color: var(--btn-color);
}
```

No hover, apenas redefine as variaveis:

```css
.btn-primary:hover {
  --btn-bgcolor: linear-gradient(...);
  --btn-color: var(--surface-color);
}
```

O ponto critico: ele usa um prefixo `--btn-` para nao conflitar com variaveis globais como `--bg-color`. Cita explicitamente: "mesmo que se repita um pouco, so para ter mais sentido, mais contexto."

## Linear gradient no hover

A funcao `linear-gradient(90deg, cor1 0%, cor2 100%)` cria um degrade horizontal (esquerda para direita). Os 90 graus definem a angulacao. O instrutor usa as cores do design system (`--bg-color-secondary` e `--bg-color-primary`) para manter consistencia.

## Decisao sobre variaveis vs valores diretos

Para o `font-size` do `.btn-large`, o instrutor calcula 18/16 = 1.125rem e coloca direto no CSS em vez de criar variavel global. Justificativa: "nesse caso aqui e so no botao que a gente vai usar." Isso evita poluir o design system com variaveis de uso unico.

## Classes utilitarias emergentes

O instrutor cria `.flex` e `.grid` como classes utilitarias durante o desenvolvimento, conforme necessidade. Nao antecipa — cria quando precisa visualizar os botoes lado a lado. Abordagem pragmatica de "deveria ter feito antes, mas nao tem problema, conforme a necessidade."

## Debugging ao vivo

O instrutor encontra um bug: `font-weight-md` nao estava sendo aplicado por causa de um tracinho faltando na variavel CSS. Usa o DevTools (inspect element) para diagnosticar. Licao: sempre verifique nomes de variaveis CSS no DevTools quando algo nao aplica.

## Dimensionamento dos botoes

Os tres tamanhos seguem o Style Guide do projeto:

| Variante | Font-size | Padding | Line-height original |
|----------|-----------|---------|---------------------|
| Small | 14px (var(--font-size-small)) | 8px 16px (0.5rem 1rem) | 24px |
| MD | 16px (var(--font-size-base)) | 12px 24px (0.75rem 1.5rem) | 24px |
| Large | 18px (1.125rem) | 16px 32px (1rem 2rem) | 24px |

O line-height e fixo em 1.5rem (24px) para todos os tamanhos, garantindo consistencia vertical.