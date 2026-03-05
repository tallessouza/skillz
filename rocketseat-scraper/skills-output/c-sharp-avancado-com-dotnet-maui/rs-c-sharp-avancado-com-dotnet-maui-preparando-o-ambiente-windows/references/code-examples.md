# Code Examples: Setup Windows para .NET MAUI

## Verificacao pos-instalacao

Esta aula e focada em instalacao de ferramentas, nao em codigo. Os exemplos abaixo servem para verificar que o ambiente esta corretamente configurado.

### Verificar .NET SDK instalado

```bash
dotnet --list-sdks
```

Saida esperada (versoes podem variar):
```
8.0.xxx [C:\Program Files\dotnet\sdk]
9.0.xxx [C:\Program Files\dotnet\sdk]
```

### Verificar workloads MAUI instalados

```bash
dotnet workload list
```

Deve listar `maui` ou `maui-windows` entre os workloads instalados.

### Criar projeto MAUI de teste via CLI

```bash
dotnet new maui -n TestApp
cd TestApp
dotnet build
```

Se o build completar sem erros, o ambiente esta corretamente configurado.

### Criar projeto MAUI via Visual Studio

1. **File** → **New** → **Project**
2. Pesquisar "MAUI" nos templates
3. Selecionar **.NET MAUI App**
4. Escolher nome e localizacao
5. Selecionar **.NET 9** no dropdown de Framework
6. Clicar em **Create**

### Verificar XAML Styler funcionando

Apos instalar a extensao, abrir qualquer arquivo `.xaml` no projeto MAUI. O XAML Styler formata automaticamente ao salvar (Ctrl+S). Exemplo de formatacao:

**Antes (sem XAML Styler):**
```xml
<Label Text="Hello" FontSize="32" HorizontalOptions="Center" VerticalOptions="Center" TextColor="Blue"/>
```

**Depois (com XAML Styler):**
```xml
<Label
    Text="Hello"
    FontSize="32"
    HorizontalOptions="Center"
    VerticalOptions="Center"
    TextColor="Blue" />
```

### Localizacao dos arquivos instalados

| Componente | Caminho padrao |
|-----------|----------------|
| Visual Studio | `C:\Program Files\Microsoft Visual Studio\2022\Community\` |
| .NET SDKs | `C:\Program Files\dotnet\sdk\` |
| Visual Studio Installer | Menu Iniciar → "Visual Studio Installer" |
| Extensoes | `%USERPROFILE%\AppData\Local\Microsoft\VisualStudio\17.0_xxx\Extensions\` |