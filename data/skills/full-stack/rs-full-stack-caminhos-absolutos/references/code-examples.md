# Code Examples: Caminhos Absolutos em HTML

## Exemplo 1: Link sem protocolo (erro)

```html
<!-- Arquivo: index.html aberto localmente -->
<a href="google.com">Ver o Google</a>
```

**O que acontece:** O navegador está no protocolo `file://`. Interpreta `google.com` como um arquivo na mesma pasta. Resultado: "arquivo não encontrado".

**URL que o navegador tenta acessar:**
```
file:///users/mike/brito/desktop/projeto/google.com
```

## Exemplo 2: Link com protocolo (correto)

```html
<a href="http://google.com">Ver o Google</a>
```

**O que acontece:** O navegador reconhece o protocolo `http://` e faz uma requisição na internet para o domínio `google.com`. O Google responde com a página inicial.

## Exemplo 3: Barra sem protocolo (raiz do SO)

```html
<a href="/index.html">Ver página</a>
```

**O que acontece no protocolo file://:** O navegador busca `file:///index.html` — a raiz do sistema operacional. Não existe um `index.html` na raiz, então dá erro.

**O que aconteceria no protocolo http://:** Buscaria `http://seusite.com/index.html` — a raiz do servidor web.

## Exemplo 4: Variações de URL absoluta válidas

```html
<!-- Todas estas são URLs absolutas válidas -->
<a href="https://google.com">Google (HTTPS)</a>
<a href="http://google.com">Google (HTTP)</a>
<a href="https://google.com/">Google (com barra final)</a>
<a href="https://google.com/search">Google Search (subpágina)</a>
```

## Exemplo 5: Estrutura completa de página com links absolutos

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Caminhos Absolutos</title>
</head>
<body>
    <!-- Links externos — sempre com protocolo -->
    <a href="https://google.com">Google</a>
    <a href="https://github.com">GitHub</a>
    <a href="https://developer.mozilla.org">MDN</a>

    <!-- Recursos externos — sempre com protocolo -->
    <img src="https://via.placeholder.com/150" alt="Placeholder">
</body>
</html>
```

## Dica do instrutor sobre workflow

- **Ctrl+S / Cmd+S** para salvar o arquivo (observar se a bolinha no título da aba sumiu)
- **Atualizar o navegador** após salvar (F5 ou Ctrl+R / Cmd+R)
- **Ctrl+/- ou Cmd+/-** para aumentar/diminuir zoom no navegador
- Sempre verificar a barra de endereço para entender qual protocolo está ativo