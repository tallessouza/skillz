# Code Examples: Instalando SQL Server

## Credenciais de Conexao

```
Server Name: {NOME_DO_COMPUTADOR} (definido automaticamente na instalacao)
Authentication: SQL Server Authentication
Login: SA
Password: @Password123 (ou a senha que voce definiu)
```

## Verificando o Servico via Windows Services

1. Pressione `Win + S` e digite "Services"
2. Na lista, localize "SQL Server (MSSQLSERVER)"
3. Status deve mostrar "Running" para conexoes funcionarem

### Comandos alternativos via terminal (PowerShell):

```powershell
# Verificar status do servico
Get-Service -Name "MSSQLSERVER"

# Iniciar o servico
Start-Service -Name "MSSQLSERVER"

# Parar o servico
Stop-Service -Name "MSSQLSERVER"

# Configurar como manual
Set-Service -Name "MSSQLSERVER" -StartupType Manual
```

## Opcoes Selecionadas Durante Instalacao

### Tela de Feature Selection
- [x] Database Engine Services
- [x] SQL Server Replication
- [ ] Machine Learning Services
- [ ] Data Quality Services
- [ ] Azure Extension for SQL Server

### Tela de Authentication
- [ ] Windows Authentication Mode
- [x] Mixed Mode (Windows Authentication and SQL Server Authentication)

### Tela de Service Configuration
| Servico | Startup Type |
|---------|-------------|
| SQL Server Database Engine | Manual (recomendado pelo instrutor) |
| SQL Server Agent | Manual |

## Fluxo Completo de Instalacao

```
1. Download SQL Server Developer Edition
   └─ Site Microsoft → secao Developer (gratuito)

2. Executar instalador
   └─ Escolher: Customized

3. Installation Center
   └─ Installation → New SQL Server Standalone Installation

4. Configuracao
   ├─ Edition: Developer (gratuita)
   ├─ Features: Database Engine + Replication apenas
   ├─ Instance: Default (MSSQLSERVER)
   ├─ Auth: Mixed Mode → senha SA → Add Current User
   └─ Install (~5 minutos)

5. SSMS
   └─ Installation Center → Install Management Tools
   └─ Download do site Microsoft (~3 minutos instalacao)

6. Primeira conexao SSMS
   ├─ Server: {nome_computador}
   ├─ Auth: SQL Server Authentication
   ├─ Login: SA / Password: {sua_senha}
   ├─ Trust Server Certificate: ✓
   └─ Connect

7. Pos-instalacao
   └─ Services → SQL Server → Startup Type: Manual
```