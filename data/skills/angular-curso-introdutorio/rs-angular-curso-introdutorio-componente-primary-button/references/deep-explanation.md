# Deep Explanation: Componente Primary Button

## Por que componentes isolados no Style Guide?

O instrutor destaca que ter componentes isolados no projeto (Style Guide) é ideal para reaproveitamento. No Figma, o Style Guide mostra cada componente separadamente — links, botões, ícones, inputs — permitindo visualizar estados e propriedades antes de implementar.

A filosofia é: **antes de codificar, consulte o Style Guide**. Cada componente tem propriedades documentadas (altura, padding, cores, gradientes) que devem ser seguidas fielmente.

## O erro clássico: background-color vs background

Este é o ponto mais importante da aula. O instrutor comete o erro ao vivo e corrige:

- `background-color` aceita apenas cores sólidas (hex, rgb, hsl)
- `linear-gradient()` é uma **imagem**, não uma cor
- Portanto, precisa da propriedade `background` (que aceita imagens) ou `background-image`

Quando o botão aparece sem cor, a primeira coisa a verificar é se usou `background-color` com gradiente.

## Convenção de nomes no Angular CLI

Ao executar `ng g c primaryButton`:
- Angular detecta a letra maiúscula no meio
- Converte automaticamente para `primary-button/` (kebab-case)
- Gera selector `app-primary-button`
- Isso é convenção do Angular, não configuração manual

O instrutor alerta: "tome muito cuidado com a letra maiúscula" — se colocar tudo minúsculo (`primarybutton`), não haverá separação e o nome fica incorreto.

## Importação obrigatória no componente pai

Com standalone components (padrão no Angular moderno), cada componente que usa outro deve importá-lo explicitamente no array `imports` do decorator `@Component`. Sem isso, Angular lança erro dizendo que o elemento é desconhecido.

O instrutor mostrou que o Angular CLI até sugere o import automaticamente no componente onde foi gerado, mas é preciso **salvar o arquivo** para o erro sumir — detalhe prático importante.

## Estados do botão: design system thinking

O Style Guide define 3 estados para cada tipo de botão:
1. **Default** — estado inicial, visual completo
2. **Hover** — mouse sobre o botão, `opacity: 0.9` (90%)
3. **Disable** — botão desabilitado, `opacity: 0.5` (50%)

A abordagem com opacity é elegante porque:
- Mantém o gradiente visível
- Não precisa redefinir cores para cada estado
- É consistente entre botão primário e secundário

## Gradiente sutil

O instrutor aumenta o botão para `width: 100%` temporariamente para demonstrar que o gradiente existe mas é muito sutil em botões pequenos. Em produção, o botão terá tamanho normal e a transição de cor será quase imperceptível — é um detalhe de refinamento visual.

## Próximos passos mencionados

- `@Input()` para receber texto e estado disable dinamicamente do componente pai
- Secondary Button seguindo a mesma estrutura
- Fonte será configurada globalmente nas próximas aulas