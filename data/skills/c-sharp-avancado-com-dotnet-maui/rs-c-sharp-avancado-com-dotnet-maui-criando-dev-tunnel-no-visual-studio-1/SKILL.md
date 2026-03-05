---
name: rs-csharp-maui-dev-tunnel
description: "Configures Visual Studio Dev Tunnel for local API debugging with mobile apps. Use when user asks to 'connect app to local API', 'debug API from device', 'create dev tunnel', 'expose localhost', or 'test mobile app with local backend'. Guides persistent tunnel setup with GitHub auth and public URL generation. Make sure to use this skill whenever setting up local development communication between a .NET MAUI app and a local API. Not for production deployment, cloud hosting setup, or ngrok configuration."
---

# Dev Tunnel no Visual Studio

> Configure um Dev Tunnel persistente no Visual Studio para expor sua API local via URL publica e permitir debug direto do dispositivo movel.

## Rules

1. **Faca login com GitHub no Visual Studio antes de criar o tunnel** — o Dev Tunnel exige autenticacao GitHub, sem isso a opcao nao aparece
2. **Use tunnel persistente, nao temporario** — tunnel persistente mantem a mesma URL entre sessoes, evitando trocar URL no app a cada execucao
3. **Selecione acesso publico** — para que o dispositivo movel acesse de qualquer rede (Wi-Fi, 4G, 5G), sem precisar estar na mesma rede local
4. **Nunca use localhost no app movel** — localhost no dispositivo aponta para o proprio smartphone, nao para seu computador
5. **Mantenha a API executando enquanto usa o tunnel** — o tunnel redireciona chamadas para sua maquina, se a API parar, as chamadas falham

## Quando usar

| Situacao | Acao |
|----------|------|
| Desenvolvimento local com app movel | Criar Dev Tunnel persistente |
| Testar app no dispositivo fisico | Usar URL publica do tunnel |
| Debug de integracao app + API | Breakpoints na API + tunnel ativo |
| Colega remoto precisa testar sua API | Compartilhar URL do tunnel |
| Producao / deploy real | NAO usar tunnel — fazer deploy na nuvem |

## Steps

### Step 1: Login com GitHub no Visual Studio
1. No Visual Studio, clique no icone de perfil (canto superior direito)
2. Selecione **Login** → conta **GitHub**
3. Autorize o Visual Studio no navegador
4. Confirme que seu avatar aparece no Visual Studio

### Step 2: Configurar Startup Project
1. Botao direito no projeto da API → **Set as Startup Project**
2. Verifique que o botao Play mostra **HTTPS**

### Step 3: Criar o Dev Tunnel
1. Clique na **seta pequena** ao lado do botao HTTPS
2. Selecione **Dev Tunnels** → **Create a Tunnel**
3. Preencha:
   - **Nome:** um nome descritivo (ex: `meu-app-tunnel`)
   - **Tipo:** **Persistent** (URL fixa entre sessoes)
   - **Acesso:** **Public** (acessivel de qualquer rede)
4. Clique **OK** e aguarde a criacao

### Step 4: Ativar o Tunnel
1. Clique novamente na seta → **Dev Tunnels**
2. Selecione o tunnel criado (deve ter um check)
3. Pressione **F5** para executar a API
4. O navegador abrira com a URL publica (formato: `xxxxx-7045.usedevtunnels.ms`)

### Step 5: Usar a URL no App
```csharp
// Substitua localhost pela URL do tunnel
private const string BaseUrl = "https://xxxxx-7045.usedevtunnels.ms";
```

## Verificacao

- Abra a URL do tunnel em uma aba anonima — deve mostrar o Swagger
- Faca uma chamada de teste pelo Swagger com a URL publica
- Coloque um breakpoint na API e confirme que ele e atingido

## Error handling

- Se o tunnel nao aparece: verifique login GitHub no Visual Studio
- Se a URL nao responde: confirme que a API esta executando (F5)
- Se nao usa Visual Studio: use **ngrok** como alternativa (ferramenta externa)

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Usar `localhost:7045` no app movel | Usar URL do Dev Tunnel |
| Criar tunnel temporario para desenvolvimento longo | Criar tunnel persistente |
| Publicar API na nuvem so para testar | Usar Dev Tunnel em desenvolvimento |
| Esquecer de selecionar o tunnel antes de F5 | Verificar check no menu Dev Tunnels |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
