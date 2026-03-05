# Deep Explanation: Imagens no HTML

## Por que o alt e tao importante

O atributo `alt` serve a tres propositos fundamentais:

### 1. Fallback visual
Quando a imagem nao carrega (URL quebrada, servidor fora, conexao lenta), o browser exibe o texto do alt no lugar. Sem alt, o usuario ve apenas um icone quebrado sem contexto.

### 2. Acessibilidade (leitores de tela)
Pessoas com deficiencia visual usam leitores de tela que leem o conteudo da pagina. O leitor nao consegue "ver" a imagem — ele le o alt. Um alt ausente ou generico como "imagem" torna o conteudo inacessivel. O instrutor enfatiza: "se uma pessoa que precisa de acessibilidade nao consegue enxergar a imagem, o alt e a descricao que o leitor de tela vai ler."

### 3. SEO (motores de busca)
O Google e outros motores de busca nao conseguem "enxergar" imagens da mesma forma que humanos. Eles dependem do alt para entender o conteudo visual. Um alt bem descrito melhora o ranqueamento da pagina para buscas de imagem e buscas gerais relacionadas ao conteudo.

## A armadilha do width + height simultaneos

O instrutor demonstra ao vivo o problema: ao colocar `width="200" height="200"` numa imagem que nao e quadrada, ela fica "feia, esticada". A regra e simples:

- **Sabe as dimensoes exatas?** Use ambos. Isso ate ajuda o browser a reservar espaco (evita layout shift).
- **Nao sabe?** Use apenas um. O browser calcula o outro proporcionalmente.

Na pratica, a maioria das imagens de conteudo (fotos, screenshots) devem usar apenas width, porque a altura varia conforme o aspect ratio.

## Fontes e formatos de imagem

O instrutor menciona varios formatos: PNG, JPG, WebP, AVIF. A evolucao dos formatos busca melhor compressao com mesma qualidade:

- **JPG**: Bom para fotos, compressao com perda. Universal.
- **PNG**: Bom para imagens com transparencia, sem perda. Arquivos maiores.
- **WebP**: Formato moderno do Google. Suporta transparencia e animacao. 25-34% menor que JPG/PNG.
- **AVIF**: Formato mais recente. Melhor compressao que WebP. Suporte crescendo.

## Direitos autorais

O instrutor usa Unsplash como exemplo de banco de imagens livres. A recomendacao e clara: "sempre cuidado com a imagem que voce vai colocar, para colocar imagens que nao tenha problemas com direitos autorais."

Fontes seguras: Unsplash, Pexels, Pixabay, imagens proprias.

## O que vem depois (mencionado pelo instrutor)

O instrutor menciona que imagens tem muito mais profundidade em estudos avancados:

- **SEO**: Atributos extras para melhorar ranqueamento
- **Performance**: Tags como `<picture>`, atributos `loading="lazy"`, `srcset` para imagens responsivas
- **CSS**: Estilizacao, object-fit, background-image

Esses topicos nao fazem parte dos fundamentos, mas sao o proximo passo natural.

## src: URL vs caminho local

O atributo `src` aceita dois tipos de endereco:

- **URL (endereco universal)**: `https://source.unsplash.com/random` — imagem hospedada em servidor externo
- **Caminho local**: `./imagens/foto.webp` — imagem no proprio projeto

Para desenvolvimento, imagens locais sao mais confiaveis (nao dependem de internet). Para prototipacao rapida, URLs de servicos como Unsplash sao praticas.