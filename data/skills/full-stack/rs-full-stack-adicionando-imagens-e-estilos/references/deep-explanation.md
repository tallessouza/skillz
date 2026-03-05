# Deep Explanation: Adicionando Imagens e Estilos

## Por que pasta assets/?

O instrutor explica que "assets" e o nome padrao para a pasta que contem imagens, PDFs, musicas e outros recursos estaticos do projeto. Nao e obrigatorio — o nome pode ser qualquer um — mas e uma convencao amplamente adotada que facilita a organizacao e a comunicacao entre desenvolvedores.

## O dilema JPG vs PNG no export do Figma

O ponto central da aula e a decisao de formato na hora de exportar imagens do Figma. O instrutor demonstra o problema com um exemplo concreto:

### Cenario: imagem com border-radius no design

No Figma, a imagem principal tem `border-radius: 16`. Ao exportar:

**Opcao 1 — PNG com bordas:**
- As curvinhas (border-radius) vao junto na imagem
- O fundo fica transparente (caracteristica do PNG)
- Se a cor de fundo mudar no futuro, a transparencia se adapta
- **Problema:** PNG e muito mais pesado que JPG

**Opcao 2 — JPG com bordas:**
- Imagem mais leve
- **Problema:** as bordas arredondadas ficam com a cor de fundo fixa (nao transparente)
- Se a cor de fundo mudar, as bordas ficam com a cor antiga — visual quebrado

**Opcao 3 (escolhida pelo instrutor) — JPG sem bordas + CSS:**
- Zera o border-radius no Figma antes de exportar
- Exporta como JPG (leve)
- Aplica `border-radius: 16px` via CSS
- Da CTRL+Z no Figma para restaurar o design original
- **Resultado:** imagem leve, bordas sempre corretas independente do fundo

### Insight do instrutor
O truque de dar CTRL+Z apos exportar e importante: voce mantem o projeto Figma original intacto (com as bordas) para referencia visual, mas exporta a versao limpa para o codigo.

## Sobre o alt text

O instrutor demonstra um bom habito ao descrever a imagem: em vez de apenas "cupcake", ele descreve o que ve — "imagem de um cupcake com graos de cafe e chantilly". Isso mostra que o alt text deve capturar o conteudo visual relevante.

## O .gitignore antes do primeiro commit

O instrutor cria o `.gitignore` com `.DS_Store` antes do primeiro commit. O `.DS_Store` e um arquivo do macOS que aparece automaticamente em pastas e nao tem relevancia para o projeto. Ignorar desde o inicio evita poluicao no historico do git.

## Workflow de link do CSS

O instrutor usa o atalho do VSCode para gerar a tag `<link>`. Ele menciona que nomeou o arquivo como `style.css` — o mesmo nome padrao que o VSCode sugere — facilitando o autocomplete. Essa e uma pratica simples mas eficiente: seguir convencoes de nomeacao reduz friccao no tooling.

## Seletor CSS para a imagem

O instrutor usa `.page-image img` como seletor. Ele nota que como so existe uma imagem dentro daquele container, pode usar a tag diretamente. Em projetos maiores, seria necessario um seletor mais especifico, mas aqui a simplicidade e adequada.