---
name: rs-csharp-dotnet-maui-instalando-mysql
description: "Guides MySQL Server and Workbench installation on Windows for .NET development. Use when user asks to 'install MySQL', 'setup MySQL Server', 'configure MySQL Workbench', 'prepare database for .NET MAUI', or 'setup local database environment'. Covers installer options, custom install, root password, Windows service management, and Workbench connection. Make sure to use this skill whenever setting up MySQL for Entity Framework or .NET API projects. Not for Linux/Mac installs, PostgreSQL, SQL Server, Docker-based MySQL, or cloud database setup."
---

# Instalando MySQL Server e Workbench no Windows

> Instale apenas o necessario (MySQL Server + Workbench) via instalacao customizada, configure o servico como manual para economizar recursos.

## Prerequisites

- Windows com acesso administrativo
- Conexao com internet para download do instalador
- Porta 3306 disponivel (padrao MySQL)

## Steps

### Step 1: Download do instalador

1. Acesse `https://dev.mysql.com/downloads/`
2. Clique em **MySQL Community Downloads**
3. Selecione **MySQL Installer for Windows**
4. Escolha a versao mais recente (ex: 8.0.41)
5. Selecione a segunda opcao: **Windows (x86, 32-bit), MSI Installer** (instalador completo)
6. Clique em "No thanks, just start my download"

### Step 2: Executar o instalador

1. Dois cliques no arquivo `.msi` baixado
2. Confirme as permissoes de seguranca do Windows (Yes)
3. Na tela de setup type, selecione **Custom** — evita instalar componentes desnecessarios

### Step 3: Selecionar produtos

Instalar apenas dois produtos:

1. **MySQL Server**: Expandir `MySQL Servers > MySQL Server 8.0 > MySQL Server 8.0.XX - X64` → clicar na seta verde para mover para a direita
2. **MySQL Workbench**: Expandir `Applications > MySQL Workbench > MySQL Workbench 8.0.XX - X64` → clicar na seta verde

Somente esses dois itens devem aparecer no painel direito. Clicar em Next → Execute.

### Step 4: Configurar o servidor

1. **Config Type**: Development Computer (maquina local de desenvolvimento)
2. **Port**: 3306 (padrao)
3. **Authentication**: Use Strong Password Encryption (primeira opcao)
4. **Root Password**: Definir senha forte (ex: `@Password123` — contem especial, maiuscula, minuscula, numeros)
5. **Windows Service**: Desmarcar "Start the MySQL Server at System Startup" — economiza recursos, inicializar manualmente quando necessario
6. Execute → Finish

### Step 5: Verificar conexao no Workbench

1. Abrir MySQL Workbench
2. Clicar em **Local Instance** (ja detecta o servidor local)
3. Inserir a senha root definida no Step 4
4. Verificar: `Server > Server Status` deve mostrar **Running**

### Step 6: Gerenciar o servico MySQL

Abrir **Services** (Servicos) no Windows:

```
# Encontrar o servico
1. Start > digitar "Services" (ou "Servicos")
2. Clicar em qualquer servico, digitar "MY" no teclado
3. Localizar "MySQL80"
```

| Acao | Como |
|------|------|
| Parar servidor | Botao direito no servico → **Stop** |
| Iniciar servidor | Botao direito no servico → **Start** |
| Verificar status | Coluna "Status" → Running ou vazio (parado) |

## Heuristics

| Situacao | Faca |
|----------|------|
| Servidor parado + Workbench nao conecta | Iniciar servico MySQL80 via Services |
| "No connection established" no Workbench | Verificar se servico esta Running |
| Escolher entre MySQL e SQL Server | Ambos funcionam com Entity Framework, diferencas minimas de configuracao |
| Quer economizar recursos | Manter startup type como Manual |

## Error handling

- Se o Workbench nao mostra Local Instance: verificar se MySQL Server foi instalado no Step 3
- Se senha nao aceita: verificar capslock e caracteres especiais
- Se porta 3306 ocupada: verificar outro servico usando `netstat -an | findstr 3306`
- Se servico nao aparece em Services: reinstalar selecionando MySQL Server no instalador

## Verification

- [ ] MySQL80 aparece em Windows Services
- [ ] Status do servico: Running (quando iniciado)
- [ ] Workbench conecta com senha root
- [ ] `Server > Server Status` mostra Running no Workbench

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
