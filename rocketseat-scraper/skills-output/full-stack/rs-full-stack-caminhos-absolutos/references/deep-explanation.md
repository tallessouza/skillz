# Deep Explanation: Caminhos Absolutos em HTML

## Por que o link sem protocolo não funciona?

Quando você abre um arquivo HTML dando dois cliques nele (ou arrastando para o navegador), o navegador usa o protocolo `file://`. Nesse contexto, o navegador interpreta qualquer href como um caminho no sistema de arquivos local.

Exemplo do instrutor: ao escrever `<a href="google.com">`, o navegador não entende que você quer ir para a internet. Ele interpreta como "procure um arquivo chamado `google.com` na mesma pasta do HTML atual". Como esse arquivo não existe, retorna "arquivo não encontrado".

## O protocolo é o que define o "universo" de busca

- **`file://`** — o navegador busca no sistema de arquivos do computador
- **`http://` ou `https://`** — o navegador faz uma requisição na internet

Sem especificar o protocolo, o navegador herda o protocolo atual. Se você está em `file://`, tudo é tratado como arquivo local.

## URL = Uniform Resource Locator

Uma URL é um "localizador uniforme de recursos". A palavra-chave é **uniforme** — segue um padrão:

```
protocolo://dominio/caminho
https://google.com/search
```

Cada parte da URL muda o destino:
- `https://google.com` → página inicial do Google
- `https://google.com/search` → outra página (o `/search` é outro local)

O instrutor demonstrou isso ao fazer uma pesquisa no Google: a URL mudou de `google.com` para `google.com/search?q=...`, mostrando que cada "barra" representa uma mudança de página/recurso.

## O que acontece com `/` sem protocolo?

Quando o href é apenas `/index.html`:
- No protocolo `file://`, o navegador busca na **raiz do sistema operacional** (ex: `/` no Mac/Linux, `C:\` no Windows)
- No protocolo `http://`, buscaria na raiz do servidor web

O instrutor mostrou: ao clicar num link com `/index.html` estando no protocolo `file://`, o navegador foi para `file:///index.html` — a raiz do computador. Como não existe um `index.html` na raiz do SO, deu erro.

## Barra final no domínio

`https://google.com` e `https://google.com/` são equivalentes. O servidor trata ambos da mesma forma. Isso é comportamento padrão do HTTP.

## Ambiente controlado vs internet

O instrutor enfatiza que ao abrir arquivos localmente, você está num "ambiente controlado" — o protocolo `file://` — e as regras são diferentes de quando o site está num servidor com `http://`. Entender essa diferença é fundamental para não se confundir com links quebrados durante o desenvolvimento.