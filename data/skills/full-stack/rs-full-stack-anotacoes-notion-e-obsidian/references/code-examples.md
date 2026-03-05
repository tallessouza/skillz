# Code Examples: Anotacoes — Notion e Obsidian

## Template de anotacao para aula (Markdown — funciona em ambos)

### Estrutura basica

```markdown
# Modulo X - Nome do Modulo

## Aula: Nome da Aula

**Data:** 2024-01-15
**Duracao:** ~10min

### Resumo
- Ponto principal 1
- Ponto principal 2

### Comandos aprendidos
```bash
# comando e o que ele faz
npm install pacote
```

### Duvidas para pesquisar
- [ ] O que e X?
- [ ] Como funciona Y?

### Links uteis
- [Documentacao oficial](url)
```

## Estrutura de pasta para curso completo

### No Obsidian (estrutura de arquivos local)

```
vault/
├── Skillz Full Stack/
│   ├── _INDEX.md              # Indice geral do curso
│   ├── 01-Configurando-Ambiente/
│   │   ├── 01-introducao.md
│   │   ├── 02-anotacoes-notion-obsidian.md
│   │   └── 03-proxima-aula.md
│   ├── 02-Proximo-Modulo/
│   │   └── ...
│   └── Snippets/              # Trechos de codigo reutilizaveis
│       ├── git-commands.md
│       └── terminal-basics.md
```

### No Notion (estrutura de paginas)

```
📄 Skillz Full Stack
  📄 Modulo 1 - Configurando Ambiente
    📄 Aula 1 - Introducao
    📄 Aula 2 - Anotacoes
    📄 Aula 3 - ...
  📄 Modulo 2 - ...
  📄 Snippets
    📄 Comandos Git
    📄 Terminal Basico
```

## Checklist de setup inicial

### Notion
```markdown
- [ ] Criar conta em notion.com
- [ ] Criar pagina "Skillz Full Stack"
- [ ] Criar subpagina para primeiro modulo
- [ ] Testar: adicionar texto, checklist, subpagina
```

### Obsidian
```markdown
- [ ] Baixar em obsidian.md
- [ ] Instalar no computador
- [ ] Criar vault "Estudos"
- [ ] Criar pasta para o curso
- [ ] Testar: criar nota, adicionar markdown
```

## Atalhos uteis

### Notion
| Acao | Atalho |
|------|--------|
| Nova pagina | `/page` |
| Checklist | `/todo` ou `/checklist` |
| Codigo | `/code` |
| Heading 1 | `/h1` ou `#` + espaco |
| Heading 2 | `/h2` ou `##` + espaco |

### Obsidian
| Acao | Atalho |
|------|--------|
| Nova nota | Ctrl+N |
| Buscar | Ctrl+O |
| Checklist | `- [ ]` + espaco |
| Codigo inline | `` `codigo` `` |
| Bloco de codigo | ` ``` ` + linguagem |
| Link entre notas | `[[nome-da-nota]]` |