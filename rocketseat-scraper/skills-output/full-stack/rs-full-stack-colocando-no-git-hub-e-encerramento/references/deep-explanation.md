# Deep Explanation: Layout Shift por Bordas

## Por que acontece

O box model do CSS calcula o espaço total de um elemento como: `content + padding + border + margin`. Quando a borda muda de 1px para 2px no `:focus`, o elemento cresce 2px verticalmente (1px em cima + 1px embaixo). Todo conteúdo abaixo é empurrado — isso é o **layout shift**.

### A analogia do instrutor (Mayk Brito)

"A gente tem um pixel nas bordas, mas quando eu clico aqui, ela vai para dois pixels nas bordas, e isso faz mexer tudo que tem abaixo dele. Por causa de um pixel a mais que vai em cima e embaixo."

Ou seja: o problema não é a borda em si, mas a **mudança de tamanho** entre estados.

## Outline vs Border

| Propriedade | Ocupa espaço no layout? | Afeta elementos vizinhos? |
|-------------|------------------------|--------------------------|
| `border` | Sim | Sim — empurra vizinhos |
| `outline` | Não | Não — "flutua" sobre o layout |

O outline é renderizado fora do box model. Isso significa que mudar outline nunca causa layout shift. Porém, outline tem limitações:
- Não suporta `border-radius` em todos os browsers
- Não pode ter lados independentes
- Não aceita `dashed` de forma confiável em todos os browsers

## A técnica da borda transparente

A solução é reservar o espaço da borda desde o início:

1. Estado base: `border: 2px solid transparent` — o espaço de 2px já está reservado
2. Estado focus: `border-color: #cor` — apenas a cor muda, o espaço permanece idêntico
3. Resultado: zero layout shift

### Por que transparent e não a cor de fundo?

Transparent funciona universalmente. Se usar a cor de fundo, precisa manter sincronizado se o fundo mudar. Transparent é invisível por definição.

## Caso especial: drop areas com borda dashed

Áreas de upload/drop geralmente usam `border: 2px dashed` no hover para indicar interatividade. A mesma técnica se aplica:

```css
.drop-area {
  border: 2px dashed transparent; /* Reserva espaço */
}

.drop-area:hover {
  border-color: #1a73e8; /* Apenas cor muda */
  outline-width: 0;     /* Remove outline padrão se existir */
}
```

O instrutor destaca que é preciso remover o `outline-width` nesse caso porque o outline padrão não é mais necessário quando a borda visível já indica o estado.

## Layout Shift como conceito

O instrutor menciona o termo "layout shift" — esse é o mesmo conceito medido pelo **Cumulative Layout Shift (CLS)** do Core Web Vitals do Google. Embora bordas em inputs não sejam a causa mais comum de CLS ruim (imagens sem dimensões e fontes carregando tarde são piores), corrigir micro-shifts em formulários melhora a percepção de qualidade e profissionalismo da interface.

## Publicação no GitHub Pages

A segunda parte da aula cobre publicação no GitHub:

1. Criar repositório público no GitHub
2. Configurar GitHub Pages na branch `main`
3. Aguardar deploy (leva alguns segundos/minutos)
4. O formulário não funcionará 100% porque precisa de backend para processar o POST

### Dicas do instrutor para o repositório

- Adicionar um README bonito com screenshot do projeto
- Listar as tecnologias aprendidas
- Manter commits descritivos (ex: "corrige layout shift, movimento do layout por causa das bordas")
- Usar o repositório como portfólio de aprendizado