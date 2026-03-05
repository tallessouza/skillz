# Deep Explanation: Estrutura de Aulas

## Por que essa estrutura?

O instrutor da Rocketseat usa uma abordagem minimalista deliberada: apenas dois arquivos (`index.html` e `script.js`). O objetivo e **eliminar fricção** entre escrever codigo e ver o resultado.

### Filosofia por tras da escolha

1. **HTML e irrelevante para o aprendizado de JS** — O instrutor explicitamente diz que vai deixar o HTML oculto em varios momentos porque "o foco nao e HTML, e JavaScript". A estrutura permite ir "direto ao ponto".

2. **Arquivo script.js sempre começa vazio** — Cada aula parte do zero. Isso evita confusao com codigo de aulas anteriores e permite foco total no conceito novo.

3. **Live Server como multiplicador de produtividade** — O instrutor enfatiza que "toda vez que eu salvar, ele ja recarrega a pagina, isso ajuda bastante na produtividade para a gente nao ter que ficar recarregando a pagina o tempo todo". O ciclo feedback fica: escrever → salvar → ver resultado instantaneamente.

### Layout fisico recomendado

O instrutor posiciona:
- VS Code no lado esquerdo da tela
- Navegador com DevTools (Console) no lado direito
- O Console do DevTools e o foco principal no navegador, nao a pagina renderizada

Isso porque a maioria dos exercicios de JavaScript intermediario usa `console.log()` para output, nao manipulacao de DOM.

### Continuidade com modulo anterior

O instrutor menciona que esta estrutura e identica a do modulo de JavaScript basico. Alunos que vieram do modulo anterior ja estao familiarizados. Para novos alunos, ele recomenda assistir o modulo anterior para ver a explicacao mais detalhada do setup.

### Extensao Live Server

A extensao mencionada e o **Live Server** de Ritwick Dey, a mais popular do VS Code para desenvolvimento web local. Ela cria um servidor local com hot-reload automatico — qualquer alteracao salva no arquivo dispara um recarregamento do navegador.