# Deep Explanation: Acessibilidade com React

## Visao geral do curso

Joseph Oliveira, instrutor de React.js na Rocketseat, apresenta o curso como uma jornada que vai da teoria ate a pratica. O ponto central e que acessibilidade nao e um topico isolado — ela permeia todo o desenvolvimento frontend.

## Por que acessibilidade importa

O instrutor enfatiza que implementar acessibilidade "nao e um trabalho facil", mas que o ferramental moderno ajuda muito. Isso reflete a realidade do mercado: muitos devs evitam a11y por achar complexo, mas as ferramentas atuais (extensoes de navegador, extensoes de VS Code, bibliotecas React) reduzem drasticamente a barreira de entrada.

## Estrutura do conhecimento

O curso segue uma progressao pedagogica clara:

1. **Teoria e Guidelines** — Entender o "por que" antes do "como". Guidelines como WCAG (Web Content Accessibility Guidelines) definem os padroes internacionais de acessibilidade. Sem essa base, implementacoes ficam ad-hoc e incompletas.

2. **Importancia e impacto** — Acessibilidade afeta usuarios com deficiencias visuais, motoras, cognitivas e auditivas. Tambem impacta SEO, usabilidade geral e compliance legal (em muitos paises).

3. **HTML Semantico** — A base de tudo. Antes de qualquer biblioteca React, o HTML nativo ja oferece muita acessibilidade gratuitamente: `<button>`, `<nav>`, `<main>`, `<label>`, `<input>` com tipos corretos. O erro mais comum de devs React e substituir tudo por `<div>` e perder toda a semantica.

4. **Landmarks** — Regioes da pagina que screen readers usam para navegacao rapida. Sem landmarks, um usuario cego precisa percorrer todo o conteudo linearmente.

5. **Layout consistente** — Manter a estrutura da pagina previsivel entre rotas. Se a navegacao muda de lugar entre paginas, usuarios que dependem de memoria espacial ficam perdidos.

6. **Ferramental** — Extensoes de navegador (axe DevTools, WAVE), extensoes de VS Code (axe Accessibility Linter) e bibliotecas React (Radix UI, React Aria, eslint-plugin-jsx-a11y). Essas ferramentas automatizam a deteccao de problemas que seriam dificeis de pegar manualmente.

## Filosofia do curso

O instrutor destaca que o curso e "bem pratico, mas vai falar muito sobre teoria tambem". Isso reflete um principio importante: acessibilidade sem entendimento teorico vira checklist mecanico. Entender o modelo mental por tras das guidelines permite tomar decisoes corretas em situacoes nao cobertas por regras explicitas.

## Conexao com o ecossistema React

React por si so nao adiciona nem remove acessibilidade — ele renderiza o HTML que voce escreve. O diferencial esta em:
- Usar componentes de bibliotecas que ja implementam ARIA patterns corretamente
- Configurar linting para pegar erros de a11y em tempo de desenvolvimento
- Testar com ferramentas automatizadas no navegador