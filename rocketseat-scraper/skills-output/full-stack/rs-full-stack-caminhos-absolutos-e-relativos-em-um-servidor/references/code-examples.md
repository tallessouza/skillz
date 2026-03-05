# Code Examples: Caminhos Absolutos e Relativos em Servidor

## Estrutura do projeto usado na aula

```
projeto/
├── index.html
├── second.html
└── subpasta/
    └── page.html
```

## Exemplo 1: Link externo (absoluto completo)

```html
<!-- index.html -->
<a href="https://google.com">Ver o Google</a>
```

Funciona em qualquer protocolo (`file://` ou `http://`) porque e uma URL completa.

## Exemplo 2: Link absoluto no servidor com barra

```html
<!-- index.html servido via http://localhost:5500/ -->

<!-- Referencia a raiz do projeto (volta para index.html) -->
<a href="/">Ficar na mesma pagina</a>

<!-- Referencia arquivo na raiz -->
<a href="/second.html">Carregar second</a>

<!-- Referencia arquivo em subpasta -->
<a href="/subpasta/page.html">Ir para subpasta</a>
```

**Resultado via http://:** Todos funcionam. A `/` resolve para o diretorio do projeto.

**Resultado via file://:** A `/` resolve para a raiz do disco. Links quebram.

## Exemplo 3: Link relativo (funciona em ambos)

```html
<!-- index.html -->
<a href="second.html">Carregar second</a>
<a href="subpasta/page.html">Ir para subpasta</a>
```

**Resultado via http://:** Funciona.
**Resultado via file://:** Funciona.

## Exemplo 4: Voltando para index a partir de second.html

### Com absoluto no servidor:

```html
<!-- second.html -->
<a href="/">Voltar para home</a>
```

Funciona apenas via `http://`.

### Com relativo (compativel):

```html
<!-- second.html -->
<a href="index.html">Voltar para home</a>
```

Funciona em ambos os protocolos.

## Exemplo 5: Navegacao a partir de subpasta

```html
<!-- subpasta/page.html -->

<!-- Absoluto no servidor -->
<a href="/">Home</a>
<a href="/second.html">Second</a>

<!-- Relativo -->
<a href="../index.html">Home</a>
<a href="../second.html">Second</a>
```

## Exemplo 6: Comparacao completa de comportamentos

```
Caminho: href="/"
  file:// → Raiz do disco (ERRO)
  http:// → index.html do projeto (OK)

Caminho: href="/second.html"
  file:// → /second.html na raiz do disco (ERRO)
  http:// → second.html na raiz do projeto (OK)

Caminho: href="second.html"
  file:// → second.html relativo ao arquivo atual (OK)
  http:// → second.html relativo ao arquivo atual (OK)

Caminho: href="subpasta/page.html"
  file:// → subpasta/page.html relativo (OK)
  http:// → subpasta/page.html relativo (OK)

Caminho: href="../index.html"
  file:// → sobe um nivel, busca index.html (OK)
  http:// → sobe um nivel, busca index.html (OK)
```

## Configurando Live Server

```
1. VS Code > Extensions (Ctrl+Shift+X)
2. Buscar "Live Server"
3. Instalar (autor: Ritwick Dey)
4. Abrir pasta do projeto no VS Code
5. Clicar "Go Live" no canto inferior direito
6. Navegador abre: http://127.0.0.1:5500/
```

**Importante:** O VS Code precisa estar com a **pasta do projeto** aberta (nao um arquivo solto). O Live Server serve o diretorio raiz que esta aberto no VS Code.