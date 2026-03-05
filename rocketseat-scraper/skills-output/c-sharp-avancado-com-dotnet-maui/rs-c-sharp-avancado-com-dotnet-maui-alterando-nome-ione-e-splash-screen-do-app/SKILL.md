---
name: rs-csharp-maui-app-identity
description: "Applies .NET MAUI app identity customization when configuring app name, icon, or splash screen. Use when user asks to 'change app name', 'customize app icon', 'add splash screen', 'configure app identity', or 'edit csproj'. Enforces correct icon structure (background + foreground SVGs), splash screen setup, and ApplicationTitle configuration. Make sure to use this skill whenever setting up or branding a .NET MAUI application. Not for app logic, navigation, or UI component development."
---

# Identidade Visual do App .NET MAUI

> Configure nome, icone e splash screen editando o .csproj e substituindo SVGs na pasta Resources.

## Rules

1. **Altere o nome no .csproj** — edite `<ApplicationTitle>` no arquivo `.csproj`, porque o nome default inclui o sufixo `.App` que nao deve aparecer para o usuario
2. **Icones usam dois SVGs** — um para background (`appicon.svg`) e outro para foreground (`appiconfg.svg`), porque dispositivos diferentes recortam o icone de formas diferentes (circulo, quadrado, bordas arredondadas)
3. **Foreground com fundo transparente** — o SVG do foreground deve ter background transparente para sobrepor corretamente o background
4. **Mantenha dimensoes 456x456** — ambos os SVGs do icone devem ser quadrados de mesma dimensao, porque o sistema espera proporcoes iguais
5. **Nao renomeie arquivos sem atualizar caminhos** — se trocar nome ou pasta dos SVGs, atualize os caminhos no `.csproj`, porque caminhos quebrados falham silenciosamente
6. **Splash screen e um SVG separado** — fica em `Resources/Splash/splash.svg`, configuravel com `BaseSize` e `Color` no `.csproj`
7. **iOS 16.4+ simulador nao mostra splash** — splash screen so aparece em dispositivo fisico assinado ou versoes anteriores do simulador
8. **Apple exige fundo opaco no icone** — diferente do Android, iOS nao permite background transparente no icone

## How to configure

### Nome do aplicativo

No arquivo `.csproj`, localize e edite:

```xml
<ApplicationTitle>PlanShare</ApplicationTitle>
```

### Icone do aplicativo

Estrutura no `.csproj`:

```xml
<ItemGroup>
    <MauiIcon Include="Resources\AppIcon\appicon.svg"
              ForegroundFile="Resources\AppIcon\appiconfg.svg"
              Color="#FFFFFF" />
</ItemGroup>
```

Substituir os SVGs em `Resources/AppIcon/`:
- `appicon.svg` — background (cor solida ou imagem)
- `appiconfg.svg` — foreground (logo/simbolo com fundo transparente)

### Splash screen

```xml
<ItemGroup>
    <MauiSplashScreen Include="Resources\Splash\splash.svg"
                      Color="#000000"
                      BaseSize="128,128" />
</ItemGroup>
```

## Example

**Before (default .csproj):**

```xml
<ApplicationTitle>PlanShare.App</ApplicationTitle>
```

**After (corrigido):**

```xml
<ApplicationTitle>PlanShare</ApplicationTitle>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Nome do app mostra sufixo `.App` | Editar `<ApplicationTitle>` no `.csproj` |
| Icone nao muda apos substituir SVG | Fazer Clean antes do Build para limpar cache |
| Splash nao aparece no simulador iOS | Testar em dispositivo fisico — limitacao do iOS 16.4+ |
| Icone aparece cortado em alguns devices | Verificar se foreground tem margem segura e fundo transparente |
| Precisa redimensionar splash | Ajustar `BaseSize` no `.csproj` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar PNG para icone do MAUI | Usar SVG (o MAUI gera os tamanhos automaticamente) |
| Colocar logo no background SVG | Logo vai no foreground, background e so cor/forma |
| Renomear SVGs sem atualizar `.csproj` | Manter nomes ou atualizar `Include` e `ForegroundFile` |
| Testar splash no simulador iOS 16.4+ | Testar em dispositivo fisico |
| Fazer background transparente para iOS | Apple exige fundo opaco — definir cor solida |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
