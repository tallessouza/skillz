# Code Examples: Configuracao do Prisma ORM

## Configuracao do VSCode settings.json

### Configuracao minima (apenas Prisma)

```json
{
  "[prisma]": {
    "editor.formatOnSave": true
  }
}
```

### Como acessar o settings.json

1. Clicar na engrenagem (canto inferior esquerdo do VSCode)
2. Selecionar "Settings" / "Configuracoes"
3. Clicar no icone de JSON (canto superior direito) para abrir como JSON
4. Adicionar a configuracao `[prisma]` dentro do objeto principal

### Exemplo com outras configuracoes existentes

```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "workbench.colorTheme": "One Dark Pro",

  "[prisma]": {
    "editor.formatOnSave": true
  }
}
```

## Comandos do Prisma

### Prisma Studio — Visualizar banco de dados

```bash
npx prisma studio
```

Abre no navegador (geralmente `http://localhost:5555`) uma interface para visualizar e editar dados do banco.

### Outros comandos uteis (referencia rapida)

```bash
# Instalar Prisma como dependencia de desenvolvimento
npm install prisma -D

# Inicializar Prisma no projeto
npx prisma init

# Gerar o client apos mudancas no schema
npx prisma generate

# Criar e aplicar migrations
npx prisma migrate dev --name nome_da_migration

# Visualizar dados no navegador
npx prisma studio
```

## Extensao do VSCode

- **Nome:** Prisma
- **Publisher:** Prisma
- **ID:** Prisma.prisma
- **Instalacao via terminal:**

```bash
code --install-extension Prisma.prisma
```

### Funcionalidades da extensao

| Funcionalidade | Descricao |
|----------------|-----------|
| Autocomplete | Sugere campos, tipos e decorators enquanto digita |
| Syntax highlight | Colore palavras reservadas como `model`, `enum`, `@@` |
| Indentacao | Formata blocos automaticamente |
| Go to definition | Navega entre models referenciados |
| Linting | Indica erros de sintaxe em tempo real |