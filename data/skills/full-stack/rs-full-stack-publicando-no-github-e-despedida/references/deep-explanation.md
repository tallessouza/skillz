# Deep Explanation: Publicando no GitHub com GitHub Pages

## Por que GitHub Pages?

O instrutor (Mayk Brito) demonstra o fluxo mais simples possivel para colocar um projeto estatico no ar: direto do repositorio GitHub, sem servidor, sem CI/CD, sem custo. Para projetos de estudo e portfolio, isso e ideal.

## O fluxo mental do instrutor

1. **Verificar no navegador** — Antes de publicar, Mayk abre o projeto em outro navegador (Edge) para validar que tudo funciona como esperado. Isso simula a experiencia de um usuario real.

2. **Limpar configs de desenvolvimento** — O projeto tinha um zoom configurado no CSS global para facilitar o desenvolvimento. Mayk remove isso antes de publicar porque e uma config de dev, nao de producao.

3. **Commit descritivo** — Mesmo sendo um ajuste pequeno ("remove zoom"), ele faz um commit separado. Cada mudanca tem seu proprio commit.

4. **Repositorio publico** — GitHub Pages gratuito so funciona com repositorios publicos. Mayk publica como publico explicitamente.

5. **Configuracao via Settings > Pages** — O caminho e: Settings → Pages → selecionar branch main → Save. O GitHub leva alguns segundos/minutos para fazer o primeiro deploy.

6. **Descricao e README** — Mayk enfatiza a importancia de adicionar uma descricao ao repositorio e criar um README bonito com imagem do projeto. Isso e uma pratica de portfolio que ele "sempre gosta de relembrar".

## Insight sobre scroll-view timeline

O instrutor menciona que a feature `scroll-timeline` (usada nas animacoes do projeto) "ainda vai ficar cada vez melhor no futuro", reconhecendo que e uma API CSS relativamente nova e em evolucao. Isso mostra consciencia de que nem tudo que se publica e estavel — mas vale experimentar e publicar mesmo assim.

## Contexto do projeto

O projeto e uma colecao de animacoes CSS (patins, rotacoes, scroll-driven animations) construido ao longo de um modulo inteiro da trilha Full Stack da Skillz. A publicacao no GitHub Pages e o passo final que transforma exercicios locais em um portfolio visivel.