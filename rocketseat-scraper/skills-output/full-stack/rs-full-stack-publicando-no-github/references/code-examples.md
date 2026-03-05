# Code Examples: Publicando no GitHub pelo VS Code

## Fluxo completo passo a passo

### Cenário 1: Publicação sem problemas

```
1. Abrir VS Code com o projeto
2. Source Control (barra lateral) → "Publish Branch"
3. Navegador abre → clicar "Allow"
4. Escolher "Private" ou "Public"
5. VS Code publica → pergunta se quer abrir no GitHub
6. Clicar "Open on GitHub" → verificar repositório
```

### Cenário 2: Nome de repositório já existe

```
1. Abrir VS Code com o projeto (pasta chamada "projeto")
2. Source Control → "Publish Branch"
3. VS Code tenta criar repo "projeto" → ERRO: já existe
4. Cancelar o fluxo
5. Fechar VS Code
6. Renomear pasta: "projeto" → "projetoreceitas-fullstack"
7. Reabrir VS Code arrastando a nova pasta
8. Source Control → "Publish Branch"
9. VS Code sugere "projetoreceitas-fullstack" → sucesso
```

### Cenário 3: Conta errada conectada

```
1. Source Control → "Publish Branch"
2. Navegador mostra conta "usuario-errado"
3. Clicar "Logout" no prompt de autenticação
4. Fazer login na conta correta
5. Clicar "Allow"
6. Continuar com o fluxo normal
```

## Boas práticas de nomeação de repositórios

```
# Ruim — genérico, causa conflitos
projeto/
teste/
app/
meu-site/

# Bom — descritivo, único
projetoreceitas-fullstack/
landing-page-rocketseat/
api-cadastro-usuarios/
portfolio-joao-2024/
```

## Verificação pós-publicação

Após publicar, confirme no GitHub:

```
Repositório → aba "Code"
  ✓ Todos os arquivos do projeto estão listados
  ✓ README aparece (se existir)

Repositório → aba "Commits"  
  ✓ Todos os commits locais aparecem
  ✓ Mensagens de commit estão corretas

Repositório → Settings → General
  ✓ Visibilidade está como esperado (Public/Private)
```