# Deep Explanation: SEO e Core Web Vitals

## O que sao Core Web Vitals

Core Web Vitals e um conjunto de metricas especificas introduzidas pelo Google para quantificar e melhorar a experiencia do usuario na web. O foco dessas metricas esta em tres aspectos criticos:

1. **Performance de carregamento** — quao rapido o conteudo principal aparece
2. **Interatividade** — quao rapido a pagina responde a interacoes do usuario
3. **Estabilidade visual** — quanto o layout "pula" durante o carregamento

### As tres metricas principais

- **LCP (Largest Contentful Paint)** — mede o tempo ate o maior elemento visivel ser renderizado. Ideal: < 2.5s. Geralmente e a hero image ou o bloco principal de texto.

- **FCP (First Contentful Paint)** — mede o tempo ate o primeiro conteudo ser pintado na tela. Indica quando o usuario percebe que algo esta carregando.

- **CLS (Cumulative Layout Shift)** — mede a quantidade de mudancas inesperadas no layout. Ideal: < 0.1. Causado por imagens sem dimensoes, fontes carregando tarde, ou conteudo injetado dinamicamente.

## Por que isso importa para ranqueamento

O Google usa essas metricas como fatores de ranqueamento. Um site com Core Web Vitals otimizados tem vantagem competitiva nos resultados de busca. O instrutor enfatiza que "entender essas metricas e muito importante para saber o que a gente consegue otimizar para melhorar o nosso ranqueamento dentro dos motores de busca."

## Open Graph e compartilhamento social

Open Graph sao as meta tags que controlam como um link aparece quando compartilhado em redes sociais (Facebook, Twitter/X, LinkedIn, WhatsApp). Sem Open Graph configurado, o link aparece sem imagem de preview e sem descricao, reduzindo drasticamente a taxa de cliques.

## PageSpeed Insights como ferramenta de verificacao

A ferramenta `pagespeed.web.dev` do Google:
- Analisa mobile E desktop separadamente
- Diagnostica problemas especificos
- Da dicas concretas de melhoria
- Reporta problemas de acessibilidade (contraste)
- Mostra erros de console
- Mede todas as metricas Core Web Vitals

O instrutor destaca que e essencial testar ambas as versoes (mobile e desktop) porque os scores podem variar significativamente — no exemplo da aula, desktop ficou com 100% de performance enquanto mobile tinha areas para melhoria.

## Insight do instrutor sobre velocidade de indexacao

Mesmo com SEO 100%, a velocidade de indexacao pode nao ser perfeita. O instrutor nota que "velocidade de indexacao esta um pouquinho lento" e que "da pra melhorar algumas coisas". Isso significa que SEO score alto nao garante indexacao rapida — sao metricas diferentes que precisam de atencao separada.