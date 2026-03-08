# Code Examples: Deploy Front-end — Introdução

## Fluxo de branches para deploy

Esta aula é introdutória e conceitual, sem código específico demonstrado pelo instrutor. Os exemplos abaixo ilustram os conceitos apresentados.

### Criando branch de feature para desenvolvimento seguro

```bash
# Estando na branch main atualizada
git checkout main
git pull origin main

# Criar branch para nova feature
git checkout -b feature/nova-funcionalidade

# Desenvolver e commitar na branch de feature
git add .
git commit -m "feat: implementa nova funcionalidade"

# Enviar branch para o GitHub
git push origin feature/nova-funcionalidade
```

### Testando e levando para produção

```bash
# Após testar a feature na branch separada
# Voltar para main e fazer merge
git checkout main
git merge feature/nova-funcionalidade

# Push na main gera nova build em produção
git push origin main
```

### Visualizando diferenças antes do merge

```bash
# Ver o que mudou na branch de feature comparado à main
git diff main...feature/nova-funcionalidade

# Ver resumo dos arquivos alterados
git diff main...feature/nova-funcionalidade --stat
```

### Estrutura típica de um projeto front-end para deploy

```
meu-projeto-frontend/
├── src/                  # Código fonte
│   ├── index.html
│   ├── styles/
│   └── scripts/
├── dist/                 # Build de produção (gerado)
├── package.json
└── .gitignore
```

### Fluxo resumido em diagrama

```
[Local Dev] ──push──→ [GitHub: feature-branch]
                              │
                         (testar/revisar)
                              │
                         merge na main
                              │
                    [GitHub: main branch]
                              │
                   (plataforma detecta push)
                              │
                    [Build automática]
                              │
                    [Produção atualizada]
```