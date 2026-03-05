# Code Examples: Espaçamento em .NET MAUI

## Tela de Login completa

### Adicionando namespace dos componentes

```xml
xmlns:components="clr-namespace:PlanShare.App.Vs.Components.Inputs"
```

### Componentes da tela de login

```xml
<components:EntryLabelComponent
    Title="E-mail"
    Placeholder="bruce@wayntech.com" />

<components:EntryLabelPasswordComponent
    Title="Senha" />
```

### Login page com espaçamentos

```xml
<VerticalStackLayout Spacing="30">
    <Label Text="Login" />

    <Label Text="Subtítulo descritivo"
           Margin="0,0,0,10" />

    <components:EntryLabelComponent
        Title="E-mail"
        Placeholder="bruce@wayntech.com" />

    <components:EntryLabelPasswordComponent
        Title="Senha" />

    <Label Text="Esqueceu sua senha?"
           Margin="0,10,0,40" />

    <Button Text="Login" />
</VerticalStackLayout>
```

## Tela de Registro com espaçamentos corrigidos

### Antes (sem spacing, margens absolutas)

```xml
<VerticalStackLayout>
    <Label Text="PlanShare" />
    <Label Text="Comande sua rotina com facilidade..."
           Margin="0,50,0,0" />
    <components:EntryLabelComponent Title="Nome" />
    <components:EntryLabelComponent Title="E-mail" />
    <components:EntryLabelPasswordComponent Title="Senha" />
    <Button Text="Criar minha conta"
            Margin="0,50,0,50" />
</VerticalStackLayout>
```

### Depois (spacing base + deltas calculados)

```xml
<VerticalStackLayout Spacing="30">
    <Label Text="PlanShare"
           Margin="0,0,0,-10" />

    <Label Text="Comande sua rotina com facilidade..."
           Margin="0,0,0,10" />

    <components:EntryLabelComponent Title="Nome" />
    <components:EntryLabelComponent Title="E-mail" />
    <components:EntryLabelPasswordComponent Title="Senha" />

    <Button Text="Criar minha conta"
            Margin="0,40,0,40" />
</VerticalStackLayout>
```

## Cálculos de espaçamento da aula

| De → Para | Design (px) | Base (Spacing) | Delta (Margin) | Cálculo |
|-----------|-------------|----------------|----------------|---------|
| Título → Subtítulo | 20 | 30 | -10 | 30-10=20 |
| Subtítulo → Nome | 40 | 30 | +10 | 30+10=40 |
| Nome → E-mail | 30 | 30 | 0 | 30+0=30 |
| E-mail → Senha | 30 | 30 | 0 | 30+0=30 |
| Senha → Botão (top) | 70 | 30 | +40 | 30+40=70 |
| Botão → próximo (bottom) | 70 | 30 | +40 | 30+40=70 |

## Formato do Margin no MAUI

```
Margin="left,top,right,bottom"
```

Exemplos:
```xml
<!-- Apenas top margin de 10 -->
Margin="0,10,0,0"

<!-- Top e bottom de 40 -->
Margin="0,40,0,40"

<!-- Top negativo de -10 -->
Margin="0,-10,0,0"

<!-- Uniforme de 20 em todos os lados -->
Margin="20"
```