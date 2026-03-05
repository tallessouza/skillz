# Code Examples: Dev Tunnel com Ngrok

## Setup completo passo a passo

### 1. Configurar autenticacao

```bash
# Windows PowerShell
.\ngrok.exe config add-authtoken 2xYourTokenHere123456

# Output esperado:
# Authtoken saved to configuration file: C:\Users\SeuUser\AppData\Local\ngrok\ngrok.yml
```

### 2. Verificar a porta da API

```
# No Swagger, a URL mostra algo como:
# https://localhost:7045/swagger/index.html
#                  ^^^^
# A porta e 7045, a URL base e https://localhost:7045
```

### 3. Criar o tunnel

```bash
# Windows PowerShell
.\ngrok.exe http https://localhost:7045

# Output:
# Session Status    online
# Account           seu-email (Plan: Free)
# Forwarding        https://8bd2-74-xxx.ngrok-free.app -> https://localhost:7045
```

### 4. Testar o tunnel

```
# Acessar no browser:
https://8bd2-74-xxx.ngrok-free.app/swagger
# Deve mostrar o Swagger da sua API

# Monitorar requisicoes:
http://localhost:4040
```

## Uso no aplicativo .NET MAUI

```csharp
// ERRADO - localhost nao funciona no dispositivo mobile
private const string BaseUrl = "https://localhost:7045";

// CORRETO - usar a URL publica do ngrok
private const string BaseUrl = "https://8bd2-74-xxx.ngrok-free.app";
```

## Fluxo de reconexao apos expiracao

```bash
# 1. URL expirou ou terminal foi fechado
# 2. Abrir terminal na pasta do ngrok
# 3. Executar novamente
.\ngrok.exe http https://localhost:7045

# 4. Copiar a NOVA URL gerada
# 5. Atualizar no aplicativo mobile
```

## Verificacao rapida se o tunnel esta funcionando

```bash
# Se retornar o HTML do Swagger, esta funcionando
curl https://SUA-URL-NGROK.ngrok-free.app/swagger/index.html

# Se retornar 404 ou erro de conexao:
# - Verificar se o terminal do ngrok esta aberto
# - Verificar se a API local esta rodando
# - Verificar se a URL nao expirou
```