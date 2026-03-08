# Deep Explanation: Update do Projeto

## Por que testar localmente antes de deployar?

O instrutor enfatiza um princípio fundamental de deploy frontend: **nunca envie para produção algo que você não verificou visualmente no seu ambiente local**. Parece óbvio, mas na prática muitos desenvolvedores fazem push de "mudanças pequenas" (como trocar uma cor) sem rodar o projeto, e acabam com surpresas em produção.

O fluxo correto é:
1. `npm run dev` — rodar localmente
2. Modificar o componente
3. Verificar no browser (localhost)
4. Só então commitar e enviar

## Reutilização de cores existentes

O instrutor demonstra uma prática importante: ao invés de inventar uma cor nova, ele **copia a cor que já estava sendo usada em outro lugar do projeto** (no caso, a cor do texto de "tentativas" no header). Isso mantém consistência visual sem precisar de um design system formal.

### Como encontrar cores existentes no projeto:
1. Inspecione o elemento visualmente atraente no browser (DevTools → Computed Styles)
2. Ou busque no código: procure por valores hex/rgb nos arquivos CSS/SCSS
3. Copie o valor exato para o novo local

## Contraste texto/fundo

Ao mudar o `background-color` de um botão, o instrutor percebeu que o texto branco original não ficava legível sobre o novo fundo amarelado. A solução foi trocar a `color` do texto para preto (`#000000`). Este é um padrão recorrente: **toda mudança de background exige revisão da cor do texto**.

## Extensão Color Highlight

O instrutor menciona a extensão **Color Highlight** para VS Code, que mostra visualmente as cores no editor. Útil mas não obrigatória — o importante é copiar os valores corretos de cor. Se não tiver a extensão, copie manualmente os códigos hex.

## Boas práticas para atualizações de projeto deployado

O contexto mais amplo da aula é sobre **como lidar com atualizações em projetos que já estão em produção**. O instrutor quer mostrar que:

1. **Mudanças pequenas também merecem verificação** — não existe "mudança tão pequena que não precisa testar"
2. **O ciclo é sempre o mesmo** — modificar → verificar → commitar → deploy
3. **CSS Modules isolam o impacto** — ao usar `button.module.css`, a mudança fica contida no componente, sem afetar outros elementos
4. **Consistência visual vem de reutilização** — copiar cores do próprio projeto é melhor que inventar novas