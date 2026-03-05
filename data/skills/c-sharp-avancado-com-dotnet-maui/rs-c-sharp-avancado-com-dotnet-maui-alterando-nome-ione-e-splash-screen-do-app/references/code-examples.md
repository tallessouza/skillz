# Code Examples: Identidade Visual do App .NET MAUI

## Estrutura completa do .csproj (secoes relevantes)

### ApplicationTitle

```xml
<!-- ANTES: nome default com sufixo -->
<ApplicationTitle>PlanShare.App</ApplicationTitle>

<!-- DEPOIS: nome limpo -->
<ApplicationTitle>PlanShare</ApplicationTitle>
```

### Configuracao do icone

```xml
<ItemGroup>
    <!-- Include aponta para o background SVG -->
    <!-- ForegroundFile aponta para o foreground SVG (logo com fundo transparente) -->
    <!-- Color define a cor de fallback -->
    <MauiIcon Include="Resources\AppIcon\appicon.svg"
              ForegroundFile="Resources\AppIcon\appiconfg.svg"
              Color="#FFFFFF" />
</ItemGroup>
```

### Configuracao da splash screen

```xml
<ItemGroup>
    <!-- Include aponta para o SVG da splash -->
    <!-- Color define a cor de fundo da splash screen -->
    <!-- BaseSize define as dimensoes base da imagem -->
    <MauiSplashScreen Include="Resources\Splash\splash.svg"
                      Color="#000000"
                      BaseSize="128,128" />
</ItemGroup>
```

## Estrutura de pastas dos recursos

```
Resources/
├── AppIcon/
│   ├── appicon.svg        # Background (cor solida, 456x456)
│   └── appiconfg.svg      # Foreground (logo, fundo transparente, 456x456)
├── Splash/
│   └── splash.svg         # Imagem da splash screen
└── ...
```

## Fluxo de substituicao de icone

```bash
# 1. Exportar SVGs do Figma (ou outra ferramenta)
# 2. Copiar para a pasta do projeto
cp ~/Desktop/appicon.svg Resources/AppIcon/appicon.svg
cp ~/Desktop/appiconfg.svg Resources/AppIcon/appiconfg.svg

# 3. No Visual Studio: botao direito no projeto > Clean
# 4. Build e Run
```

## Fluxo de substituicao da splash screen

```bash
# 1. Exportar SVG do Figma
cp ~/Desktop/splash.svg Resources/Splash/splash.svg

# 2. Editar cor e tamanho no .csproj se necessario
# 3. Clean + Build + Run
```

## Usando scrcpy para espelhar dispositivo Android

```bash
# Navegar ate a pasta do scrcpy
cd "C:\Program Files\scrcpy"

# Executar (dispositivo deve estar conectado via USB com modo desenvolvedor ativo)
.\scrcpy.exe
```

## Variacao: mudando apenas a cor do background do icone

```xml
<!-- Trocar a cor sem alterar os SVGs -->
<MauiIcon Include="Resources\AppIcon\appicon.svg"
          ForegroundFile="Resources\AppIcon\appiconfg.svg"
          Color="#FF69B4" />  <!-- Rosa -->
```

## Variacao: redimensionando a splash screen

```xml
<!-- Splash maior -->
<MauiSplashScreen Include="Resources\Splash\splash.svg"
                  Color="#000000"
                  BaseSize="210,260" />

<!-- Splash menor -->
<MauiSplashScreen Include="Resources\Splash\splash.svg"
                  Color="#FFFFFF"
                  BaseSize="64,64" />
```

## Startup Project no Visual Studio

Quando o projeto tem multiplos executaveis (ex: API + App), e necessario definir qual e o projeto de inicializacao:

1. Botao direito no projeto `.App`
2. Clicar em "Set as Startup Project"
3. Verificar se o dispositivo aparece no seletor