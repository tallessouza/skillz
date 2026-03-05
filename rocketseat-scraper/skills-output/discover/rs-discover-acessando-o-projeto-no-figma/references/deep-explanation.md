# Deep Explanation: Extraindo Informacoes do Figma para Codigo

## O papel do Figma no fluxo de desenvolvimento

O instrutor (Mayk Brito) faz questao de deixar claro uma separacao fundamental de responsabilidades: **quem cria o layout nao e a pessoa programadora**. No caso do projeto DevLinks, quem criou foi a Ilana, uma Product Designer (PD) da Rocketseat.

Isso significa que o Figma e uma ferramenta de **consumo** para devs, nao de **producao**. Voce nao precisa saber criar layouts — precisa saber **ler** layouts.

### A analogia implicita

Pense no Figma como uma planta de arquitetura. O arquiteto (designer) desenha a planta. O engenheiro (dev) le a planta e constroi. Voce nao precisa saber desenhar plantas para construir uma casa — mas precisa saber interpreta-las.

## UI vs UX — Contexto rapido

O instrutor menciona dois termos importantes:
- **UI (User Interface):** A interface visual — como as coisas parecem (cores, fontes, espacamentos, layout)
- **UX (User Experience):** A experiencia do usuario — como as coisas funcionam (fluxos, interacoes, facilidade de uso)

No contexto de extrair informacoes do Figma, voce esta primariamente lidando com **UI** — propriedades visuais que viram CSS.

## Style Guide — Por que e importante

O Style Guide e um frame dentro do projeto Figma que concentra todas as decisoes visuais:
- **Cores:** Paleta completa do projeto
- **Fontes:** Familias tipograficas, pesos, tamanhos
- **Icones:** Set de icones utilizados
- **Componentes:** Pecas reutilizaveis (botoes, cards, inputs)
- **Imagens:** Assets visuais do projeto

O instrutor destaca: "Nao necessariamente voce vai me ver usando isso em aula" — mas e a referencia oficial. Na pratica profissional, o Style Guide e o primeiro lugar que voce consulta antes de escrever qualquer CSS.

## Navegacao no Figma — Detalhes

### Zoom
- **Windows/Linux:** Ctrl + scroll do mouse
- **Mac:** Cmd + scroll do mouse
- Permite ver o projeto de longe (visao geral) ou de perto (detalhes de um componente)

### Mover pela pagina
- Segure **Espaco** + clique + arraste
- Funciona como o "hand tool" — voce navega pela tela sem selecionar nada

### Selecionar elementos
- Clique simples em qualquer elemento
- Cliques sucessivos entram em niveis mais profundos (frame > grupo > elemento)
- No painel direito, aparecem todas as propriedades: tamanho, cor, fonte, border, etc.

### Medir espacamentos (tecla Alt)
- Selecione um elemento
- Segure **Alt** e passe o mouse sobre outros elementos
- Linhas vermelhas/rosas aparecem mostrando a distancia em pixels
- Esses numeros viram `margin`, `padding`, ou `gap` no CSS

## Diferenças entre versoes

O instrutor avisa explicitamente: "em algumas aulas futuras, voce nao vai ver dessa maneira que voce esta vendo aqui, porque a gente fez uma melhoria nesse projeto". Isso e comum em cursos — o layout evolui. O importante e que as **propriedades dos elementos** (cores, fontes, espacamentos) permanecem as mesmas, mesmo que a organizacao visual do arquivo Figma mude.

## Edge cases

- **Projeto nao abre:** Verifique se voce esta logado no Figma e se o link e publico
- **Nao consegue selecionar elementos:** Pode ser que o frame esteja bloqueado — tente clicar duas vezes para entrar nos sub-elementos
- **Valores fracionados (ex: 16.5px):** Arredonde para o inteiro mais proximo no CSS
- **Cores com opacidade:** O Figma mostra a opacidade separada — no CSS, use `rgba()` ou `opacity`