# Deep Explanation: Estilização CSS no React — Fundamentos

## Filosofia do instrutor

O instrutor enfatiza uma abordagem **incremental e fundamentalista**: antes de qualquer framework ou abstração de CSS, o desenvolvedor precisa entender como CSS funciona nativamente dentro do ecossistema React.

### Por que fundamentos primeiro?

A analogia implícita é a de construção: você não coloca o telhado antes das paredes. Os "pilares do React" são apresentados em sequência deliberada:

1. **Componentes** — a unidade básica de construção
2. **JSX** — a linguagem que descreve a estrutura
3. **Estilização (CSS)** — a camada visual que dá forma

Cada pilar depende do anterior. Tentar estilizar sem entender componentes leva a código desorganizado. Tentar usar CSS Modules sem entender CSS básico no React leva a frustrações desnecessárias.

### O papel do projeto prático

O instrutor menciona explicitamente que após os fundamentos, virá um projeto prático. Isso reflete a metodologia Rocketseat: **teoria focada → prática consolidadora**. Os fundamentos não existem em isolamento — eles ganham significado quando aplicados em um projeto real.

## Progressão recomendada de estilização no React

### Nível 1: CSS importado diretamente
```
import './styles.css'
```
O jeito mais simples. O CSS é global e se aplica a toda a aplicação. Bom para estilos base e resets.

### Nível 2: CSS por componente
Cada componente tem seu arquivo CSS correspondente. Ainda global tecnicamente, mas organizado por responsabilidade.

### Nível 3: CSS Modules
Escopo automático por componente. Nomes de classe são gerados únicos, evitando conflitos.

### Nível 4: CSS-in-JS / Tailwind
Abstrações mais poderosas que resolvem problemas específicos de escala.

## Conexão com outros pilares

O instrutor reforça que estilização é o **terceiro pilar** depois de componentes e JSX. Essa sequência não é arbitrária:

- **Componentes** definem O QUE existe na tela
- **JSX** define COMO é estruturado
- **CSS** define COMO aparece visualmente

Sem componentes bem definidos, estilos ficam acoplados a estruturas frágeis. Sem JSX bem compreendido, a aplicação de classes e estilos inline fica confusa.

## Edge cases e considerações

- **Estilos globais vs. locais**: No React, é comum ter um `global.css` para resets e variáveis, e estilos locais por componente. Entender essa separação desde o início evita problemas de especificidade.
- **className vs. class**: Em JSX, o atributo é `className`, não `class`. Esse é um dos primeiros pontos de confusão para quem vem do HTML puro.
- **Inline styles em JSX**: Usam objetos JavaScript, não strings CSS. `style={{ color: 'red' }}` e não `style="color: red"`.