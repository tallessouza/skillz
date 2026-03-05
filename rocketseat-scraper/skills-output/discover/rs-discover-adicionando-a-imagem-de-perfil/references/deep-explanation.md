# Deep Explanation: Adicionando Imagem de Perfil

## O atributo `src` — "em que lugar do mundo esta essa imagem"

O instrutor usa uma analogia poderosa: o `src` responde a pergunta "em que lugar do mundo esta essa imagem?". Isso pode ser:

1. **Local (relativo):** `./assets/avatar.png` — o arquivo esta na pasta do projeto
2. **Remoto (absoluto):** `https://github.com/maykbrito.png` — o arquivo esta em um servidor

### Como funciona a URL remota

O instrutor explica o fluxo completo:
- `https://` e o protocolo de transferencia de hipertextos (imagens, HTML, CSS)
- `github.com` e o dominio que sera resolvido para um endereco IP
- O IP aponta para uma maquina fisica (provavelmente nos EUA)
- Dentro dessa maquina, em algum lugar, esta guardada a fotografia

Essa explicacao demonstra que `src` e literalmente um endereco — local ou global — e o browser sabe buscar em ambos.

## O atributo `alt` — tres propositos

O instrutor apresenta tres razoes para o texto alternativo:

### 1. Fallback visual
"E se eu nao encontrar essa imagem, o que eu vou escrever aqui?" — quando a imagem falha ao carregar, o browser exibe o texto do `alt` no lugar.

### 2. Acessibilidade
"E se uma pessoa que tem uma necessidade visual nao esta conseguindo ver essa imagem, como voce descreveria essa imagem?" — leitores de tela leem o `alt` para usuarios com deficiencia visual.

### 3. SEO (motores de busca)
"O Google nao consegue interpretar essa imagem. Que palavras voce colocaria aqui para descrever essa imagem?" — crawlers usam o `alt` para indexar o conteudo da imagem.

### Exemplo do instrutor
O instrutor descreve a propria foto: "Foto de Mike Brito sorrindo, usando oculos e camisa preta, barba e fundo amarelo". Note que inclui:
- Quem e a pessoa (nome)
- O que esta fazendo (sorrindo)
- Detalhes visuais relevantes (oculos, camisa, barba)
- Contexto visual (fundo amarelo)

## Workflow de exportacao de imagem

### Do Figma para o projeto
1. Selecionar o elemento (no caso, o avatar)
2. Clicar em "Export"
3. Selecionar formato PNG
4. Configurar multiplicador para 3x (qualidade para retina)
5. Salvar na pasta assets

### Lidando com .zip
- O Figma pode exportar como .zip
- No Mac: dois cliques para extrair
- No Windows: botao direito → Extrair / Extract
- O .zip e "um tipo de arquivo que contem arquivos dentro"
- Apos extrair, mover o asset para a pasta correta
- Deletar o .zip e pastas intermediarias desnecessarias

### Organizacao de assets
- Renomear para minusculas (o instrutor renomeia de "A" maiusculo para "a" minusculo)
- Manter na pasta `assets/` junto com outros recursos como `bg-mobile.png`
- Limpar arquivos temporarios (.zip, pastas intermediarias)

## Estrutura HTML: div como container

O instrutor cria a estrutura com:
```html
<div id="profile">
  <img src="./assets/avatar.png" alt="...">
</div>
```

A `div` com `id="profile"` serve como caixa container para a imagem. Ele usa o atalho do editor: `#profile` + Enter para gerar `<div id="profile"></div>` automaticamente (Emmet).