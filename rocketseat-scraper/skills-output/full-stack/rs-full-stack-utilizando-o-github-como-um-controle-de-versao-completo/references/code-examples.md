# Code Examples: GitHub como Editor via github.dev

## Fluxo 1: Editar um arquivo e fazer commit individual

```
1. Acesse github.com/{user}/{repo}
2. Pressione `.` no teclado
3. URL muda para github.dev/{user}/{repo}
4. Navegue até o arquivo (ex: README.md)
5. Edite o conteúdo:
   - Adicione: "título do meu projeto"
   - Adicione: "descrição do meu projeto"
6. No painel Source Control, clique `+` no README.md
7. Escreva: "update readme"
8. Clique: Commit & Push
```

**Resultado:** Um commit com a mensagem "update readme" aparece no histórico do repositório.

## Fluxo 2: Commit de múltiplos arquivos simultaneamente

```
1. Edite arquivo1.txt (ex: remover uma letra)
2. Edite arquivo2.txt (ex: remover uma linha)
3. No painel Source Control, ambos aparecem com `M`
4. Clique `+` no header "Changes" (stage all)
5. Escreva: "update several files"
6. Clique: Commit & Push
```

**Resultado:** Um único commit com todas as alterações.

## Fluxo 3: Deletar um arquivo

```
1. No explorador, botão direito no arquivo (ex: hello.txt)
2. Selecione "Delete Permanently"
3. O arquivo desaparece do explorador
4. No painel Source Control, aparece riscado com indicador de deleção
5. Escreva: "deleted hello.txt"
6. Clique: Commit & Push
```

**Resultado:** Arquivo removido do repositório.

## Fluxo 4: Restaurar arquivo deletado (antes do commit)

```
1. Delete um arquivo (botão direito → Delete Permanently)
2. Vá ao painel Source Control
3. O arquivo aparece listado com indicador de deleção
4. Clique na seta de restore (↩) ao lado do arquivo
5. O arquivo volta ao explorador
```

**Resultado:** Deleção descartada, arquivo restaurado.

## Fluxo 5: Voltar ao GitHub para verificar

```
1. Na barra de endereço do navegador
2. Altere: github.dev/{user}/{repo}
3. Para:   github.com/{user}/{repo}
4. Verifique:
   - Arquivos atualizados na listagem
   - Commits visíveis no histórico
   - Mensagens de commit corretas
```

## Resumo dos indicadores visuais no editor

```
Arquivo no explorador:
  nome.txt  M        → Arquivo modificado
  nome.txt  (riscado) → Arquivo deletado

Linhas no editor:
  │ verde   → Linha nova (adicionada)
  │ amarelo → Linha alterada (modified)
  ◄ vermelho → Linha removida (clique para ver original)

Painel Source Control:
  [+]  → Adicionar ao stage (por arquivo)
  [+]  → Adicionar todos ao stage (no header "Changes")
  [↩]  → Restaurar/descartar mudança
```