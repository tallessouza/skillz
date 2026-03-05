# Deep Explanation: O Projeto no Figma

## Por que duplicar o projeto?

Quando voce recebe um link de projeto no Figma, ele vem como read-only ("Ask to edit"). Isso protege o original. Ao duplicar para seus drafts, voce ganha acesso completo para:
- Inspecionar propriedades de qualquer elemento
- Medir espacamentos entre elementos
- Exportar imagens e icones
- Ver valores exatos de cores, fontes e tamanhos

Nunca edite o projeto original — ele serve como fonte de verdade para toda a equipe.

## Navegacao eficiente no Figma

### Zoom inteligente
O atalho `Ctrl + scroll` e o mais usado no dia a dia. O zoom segue a posicao do cursor, entao aponte para a area que quer ampliar antes de rolar. Isso evita ficar perdido no canvas.

### Paginas do projeto
Projetos bem organizados separam:
- **Projeto/Layout**: o design final que voce vai implementar
- **Style Guide**: tokens de design (cores, fontes, espacamentos, icones)
- **Prototipo**: interacoes e fluxos (nem sempre presente)

O instrutor enfatiza que o style guide e o ponto de partida ideal — antes mesmo de escrever HTML, voce ja pode preparar suas variaveis CSS.

## O Style Guide como contrato visual

O style guide funciona como um contrato entre designer e desenvolvedor. Ele define:

### Cores
Todas as cores do projeto listadas com seus valores hex/rgb. A recomendacao e transformar em variaveis CSS assim que possivel.

### Tipografia
- Familia da fonte (com link para Google Fonts)
- Hierarquia: h1, h2, paragrafos com seus tamanhos, pesos e alturas de linha
- Isso mapeia diretamente para regras CSS

### Icones
Biblioteca de icones utilizada (neste caso, Phosphor Icons). Saber qual biblioteca permite importar corretamente no projeto.

### Imagens
Origem das imagens (Unsplash neste caso). Importante para:
- Atribuicao correta
- Saber que pode exportar direto do Figma
- Entender que sao imagens de placeholder vs. assets finais

## Abordagem do instrutor: parte a parte

O instrutor destaca que NAO recomenda configurar todo o CSS antes do HTML. A abordagem preferida e:
1. Desenvolver parte a parte
2. Entender como exportar imagens
3. Ver como esta o texto
4. Verificar espacamentos
5. Ir fazendo com calma, no decorrer das aulas

Isso reflete uma filosofia de desenvolvimento incremental — construir e estilizar componente por componente, ao inves de tentar abstrair tudo de uma vez.

## Modo de codigo no Figma

Algumas contas Figma (pagas) tem acesso ao "Dev Mode" que mostra propriedades CSS diretamente. O instrutor menciona mas nao usa, porque nem todos os alunos tem acesso. Na pratica, inspecionar elementos manualmente funciona igualmente bem para projetos de estudo.