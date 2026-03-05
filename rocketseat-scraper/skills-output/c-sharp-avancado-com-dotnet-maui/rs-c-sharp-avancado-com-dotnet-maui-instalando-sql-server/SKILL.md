---
name: rs-csharp-dotnet-maui-instalando-sql-server
description: "Guides SQL Server installation and configuration on Windows for .NET development. Use when user asks to 'install SQL Server', 'setup database for .NET', 'configure SSMS', 'setup SQL Server for API', or 'manage SQL Server services'. Covers Developer edition install, mixed mode auth, SSMS setup, and Windows service management. Make sure to use this skill whenever setting up SQL Server for local .NET/C# development. Not for MySQL setup, Azure SQL, production deployment, or Linux installations."
---

# Instalando SQL Server para Desenvolvimento .NET

> Instale e configure o SQL Server Developer Edition com SSMS para desenvolvimento local de APIs .NET.

## Prerequisites

- Windows 10/11
- Conexao com internet para download
- Permissao de administrador na maquina

## Steps

### Step 1: Download do SQL Server Developer Edition

1. Acesse o site de downloads do SQL Server da Microsoft
2. Role a pagina ate encontrar a versao **Developer** (gratuita)
3. Clique em **Download**

### Step 2: Instalacao Customizada

1. Execute o instalador e selecione **Developer Edition**
2. Escolha a opcao **Customized** (nao Basic) — para nao instalar componentes desnecessarios
3. Na tela de features, marque apenas:
   - **Database Engine Services**
   - **SQL Server Replication**
4. Nao marque Machine Learning, Data Quality Services, nem Azure extensions

### Step 3: Configurar Autenticacao (CRITICO)

1. Selecione **Mixed Mode** (nao apenas Windows Authentication)
   - Mixed Mode permite autenticacao por usuario/senha, necessario para APIs se conectarem
2. Defina a senha do usuario **SA** (administrador padrao)
3. Clique em **Add Current User** para adicionar seu usuario Windows como admin tambem

```
Usuario padrao: SA
Senha exemplo: @Password123 (use caractere especial + maiuscula + numero)
```

### Step 4: Instalar SSMS (SQL Server Management Studio)

1. No Installation Center, clique em **Install SQL Server Management Tools**
2. Sera redirecionado ao site da Microsoft — baixe o SSMS
3. Execute o instalador e aguarde (~3 minutos)

### Step 5: Conectar via SSMS

1. Abra o SSMS pelo menu Start
2. Selecione **SQL Server Authentication**
3. Login: `SA`, Password: a senha definida no Step 3
4. Marque **Trust Server Certificate** antes de conectar
5. Conexao feita — voce vera as databases no painel lateral

### Step 6: Configurar Servico como Manual

1. Abra **Services** (Servicos) no Windows
2. Encontre **SQL Server** na lista
3. Clique com botao direito → **Properties** → Startup type: **Manual**
4. Isso evita consumo de CPU/memoria quando nao estiver usando

Para iniciar/parar manualmente:
- Botao direito no servico → **Start** / **Stop**

## Heuristics

| Situacao | Faca |
|----------|------|
| Nao consegue conectar pelo SSMS | Verifique se o servico SQL Server esta rodando em Services |
| Erro de certificado ao conectar | Marque "Trust Server Certificate" na tela de login |
| Quer economizar recursos da maquina | Deixe o servico como Manual, inicie apenas quando precisar |
| Precisa que a API se conecte | Use Mixed Mode auth com usuario SA e senha definida |

## Error handling

- Se o servico nao aparece em Services: a instalacao pode ter falhado, reinstale
- Se SSMS nao reconhece o servidor: verifique o nome da instancia (padrao: nome do computador)
- Se login SA falha: confirme que Mixed Mode foi selecionado durante a instalacao

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
