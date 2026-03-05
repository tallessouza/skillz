# Deep Explanation: Enriquecimento de Base de Conhecimento para Chat AI

## Contexto do Desafio

O instrutor propoe como projeto final a implementacao de um sistema de receitas que enriquece a base de conhecimento de um marketplace inteligente com AI. O sistema ja possui um chat funcional, e o desafio e permitir que usuarios adicionem conhecimento proprio (receitas) que serao consideradas nas respostas.

## As Tres Abordagens Discutidas

### 1. Inline no Prompt (Tudo Junto)

O instrutor menciona: "será que faz sentido eu pegar essas receitas, esses inputs que podem ser texto, PDF, e mandar ele junto do prompt?"

**Como funciona:** Concatena todo o conteudo das receitas diretamente no system prompt ou user prompt antes de enviar para a API (OpenAI, por exemplo).

**Quando usar:** Volume pequeno de conteudo. Se o usuario tem 3-4 receitas curtas, o custo de token e aceitavel e a implementacao e trivial.

**Limitacao:** Context window tem limite. Custo cresce linearmente. Latencia aumenta com prompts grandes.

### 2. Vetorizacao com Vector Store

O instrutor menciona: "será que faz sentido eu fazer o processo de vetorização antes usando a vector store da OpenAI?"

**Como funciona:** Converte cada receita em embeddings vetoriais, armazena num vector store, e na hora do chat faz busca semantica para trazer apenas as receitas relevantes para a pergunta do usuario.

**Quando usar:** Muitas receitas, ou receitas longas. A busca semantica garante que so o conteudo relevante vai pro contexto.

**Vantagem:** Escala bem. Custo de tokens por request fica controlado independente do volume total.

### 3. Extracao de Texto + Processamento Customizado

O instrutor menciona: "ou extrai o texto e faça de outra forma"

**Como funciona:** Extrai texto dos PDFs, faz parsing/limpeza, e decide a melhor rota (pode ser inline, vector store, ou banco de dados com busca tradicional).

**Quando usar:** Quando os documentos tem estrutura especifica que pode ser aproveitada (ingredientes, modo de preparo, tempo, etc).

## Insight do Instrutor: Nao Existe Bala de Prata

O instrutor enfatiza: "são várias formas que a gente pode solucionar o problema. Não tem pontos negativos, pontos positivos. Cada um vai se adequar a um caso de uso ou outro."

A escolha depende de:
- **Volume de conteudo** — pouco conteudo = inline, muito = vectorize
- **Tipo de consulta** — perguntas genericas sobre todas receitas vs perguntas sobre receita especifica
- **Infraestrutura disponivel** — vector store requer setup adicional
- **Budget de tokens** — inline custa mais por request em volumes altos

## Formatos de Entrada

O sistema deve aceitar dois formatos:
1. **Upload de PDF** — requer biblioteca de extracao (pdf-parse, pdfjs, etc)
2. **Texto digitado** — input direto, sem processamento de arquivo

Ambos devem ser normalizados para texto puro antes de entrar no pipeline de conhecimento.