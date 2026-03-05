# Code Examples: Instalando MySQL Server e Workbench

## Gerenciamento do servico via linha de comando

Alternativa ao gerenciamento visual pelo Services do Windows:

```powershell
# Iniciar o servico MySQL
net start MySQL80

# Parar o servico MySQL
net stop MySQL80

# Verificar status
sc query MySQL80
```

## Verificar porta em uso

```powershell
# Verificar se porta 3306 esta em uso
netstat -an | findstr 3306

# Saida esperada quando MySQL esta rodando:
# TCP    0.0.0.0:3306    0.0.0.0:0    LISTENING
```

## Conectar via linha de comando (alternativa ao Workbench)

```bash
# Conectar ao MySQL Server local
mysql -u root -p
# Digitar a senha quando solicitado

# Verificar se esta funcionando
SHOW DATABASES;

# Sair
EXIT;
```

## String de conexao para .NET (contexto do curso)

```csharp
// appsettings.json — conexao com MySQL local
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=NomeDoBanco;Uid=root;Pwd=@Password123;"
  }
}
```

## Configuracoes do instalador — resumo visual

```
Setup Type: Custom
  ├── MySQL Server 8.0.XX - X64     ✓ (seta verde → direita)
  ├── MySQL Workbench 8.0.XX - X64  ✓ (seta verde → direita)
  └── Tudo mais                     ✗ (nao selecionar)

Server Config:
  ├── Config Type: Development Computer
  ├── Port: 3306
  ├── Auth: Strong Password Encryption
  ├── Root Password: [sua senha forte]
  └── Startup: Manual (desmarcado)
```

## Fluxo de uso diario

```
1. Abrir Services (Win+R → services.msc)
2. Localizar MySQL80
3. Botao direito → Start
4. Abrir MySQL Workbench
5. Clicar em Local Instance
6. Inserir senha root
7. Desenvolver...
8. Ao terminar: Services → MySQL80 → Stop
```