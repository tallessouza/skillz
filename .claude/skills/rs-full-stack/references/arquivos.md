---
name: rs-full-stack-arquivos
description: "Applies file types and extensions knowledge when working with web files, assets, or media. Use when user asks to 'handle files', 'work with extensions', 'organize assets', 'choose file format', or discusses file types in web projects. Ensures correct extension usage, file-application associations, and understanding that code files BUILD applications. Make sure to use this skill whenever dealing with file formats, media types, or asset organization in web projects. Not for file system operations, OS-level file management, or database storage."
---

# Arquivos — Do Físico ao Virtual

> Todo arquivo digital possui uma extensao que identifica seu tipo, e precisa do aplicativo correto para ser interpretado.

## Key concept

Arquivos (files) sao a unidade fundamental da computacao. Cada arquivo possui uma **extensao** (file extension) — o sufixo apos o ponto no nome — que identifica seu tipo e determina qual aplicativo pode interpreta-lo. O termo "file" aparece constantemente em programacao: filesystem, file upload, file reader, config file.

O ciclo fundamental: **aplicativos interpretam arquivos, e arquivos criam aplicativos.** Codigo-fonte sao arquivos que, quando processados, geram os programas que abrem outros arquivos.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Precisa escolher formato de documento | `.pdf` para distribuicao, `.docx` para edicao |
| Precisa escolher formato de imagem | `.jpg` para fotos, `.png` para transparencia, `.svg` para vetores, `.webp` para web |
| Precisa escolher formato de video | `.mp4` para compatibilidade universal |
| Precisa escolher formato de audio | `.mp3` para compatibilidade, `.ogg`/`.wav` para qualidade |
| Arquivo nao abre | Verificar se o aplicativo correto esta instalado |
| Criando projeto web | Arquivos `.html`, `.css`, `.js`/`.ts` sao o codigo-fonte que CRIA a aplicacao |

## How to think about it

### Extensao = Identidade do arquivo

A extensao diz ao sistema operacional e ao desenvolvedor o que aquele arquivo contem. Sem extensao (ou com extensao errada), o sistema nao sabe qual programa usar para abri-lo. Em programacao, voce vai lidar com dezenas de extensoes:

- `.html` — estrutura da pagina
- `.css` — estilos visuais
- `.js` / `.ts` — logica e comportamento
- `.json` — dados estruturados
- `.env` — variaveis de ambiente
- `.md` — documentacao

### O ciclo arquivo-aplicativo

Arquivos `.js` sao interpretados pelo Node.js ou pelo navegador para CRIAR uma aplicacao. Essa aplicacao, por sua vez, interpreta outros arquivos (imagens, PDFs, videos). O arquivo e ao mesmo tempo **insumo** e **produto** da programacao.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Extensao e so estetica | Extensao determina como o SO e aplicativos tratam o arquivo |
| Qualquer programa abre qualquer arquivo | Cada tipo de arquivo precisa do aplicativo compativel |
| Arquivos de codigo sao diferentes de "arquivos normais" | Codigo-fonte sao arquivos de texto com extensoes especificas (`.js`, `.html`, `.css`) |
| Mudar a extensao converte o arquivo | Renomear `.jpg` para `.png` nao converte — o conteudo interno permanece igual |

## When to apply

- Ao organizar assets de um projeto web (imagens, fontes, videos)
- Ao escolher formatos para upload/download de arquivos
- Ao configurar MIME types em servidores
- Ao definir `accept` em inputs de file upload
- Ao debugar problemas de "arquivo nao abre" ou "formato invalido"

## Limitations

Este conceito e introdutorio. Nao cobre: MIME types detalhados, encoding de arquivos binarios, streams, buffers, ou manipulacao programatica de arquivos com filesystem APIs.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a transicao fisico-virtual e o ciclo arquivo-aplicativo
- [code-examples.md](references/code-examples.md) — Exemplos praticos de extensoes e uso em projetos web

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-arquivos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-arquivos/references/code-examples.md)
