# Code Examples: Botoes com Grid e Estilos no .NET MAUI

## 1. Grid completo com dois botoes

```xml
<Grid ColumnDefinitions="*,*" ColumnSpacing="20" Margin="0,70,0,25">
    <Button Grid.Column="0"
            Text="{x:Static resources:AppResource.ChangePassword}"
            Style="{StaticResource SecondaryButtonStyle}" />
    <Button Grid.Column="1"
            Text="{x:Static resources:AppResource.UpdateProfile}" />
</Grid>
```

**Explicacao passo a passo:**
- `ColumnDefinitions="*,*"` — duas colunas de largura igual
- `ColumnSpacing="20"` — 20px entre as colunas
- `Grid.Column="0"` — primeiro botao na primeira coluna (indice comeca em 0)
- `Grid.Column="1"` — segundo botao na segunda coluna
- Primeiro botao usa `SecondaryButtonStyle`, segundo usa o estilo global

## 2. Botao de deletar conta (fora do Grid)

```xml
<Button Text="{x:Static resources:AppResource.DeleteMyAccount}"
        Style="{StaticResource DangerousButtonStyle}" />
```

Declarado como irmao do Grid no VerticalStackLayout, nao dentro do Grid.

## 3. Estilo SecondaryButtonStyle completo

```xml
<Style x:Key="SecondaryButtonStyle" TargetType="Button">
    <Setter Property="BackgroundColor" Value="Transparent" />
    <Setter Property="TextColor"
            Value="{AppThemeBinding
                Light={StaticResource PrimaryColorLight},
                Dark={StaticResource PrimaryColorDark}}" />
    <Setter Property="BorderColor"
            Value="{AppThemeBinding
                Light={StaticResource PrimaryColorLight},
                Dark={StaticResource PrimaryColorDark}}" />
    <Setter Property="BorderWidth" Value="2" />
</Style>
```

**Propriedades sobrescritas do estilo global:**
- `BackgroundColor` — de cor primaria para transparente
- `TextColor` — de cor secundaria para cor primaria
- `BorderColor` e `BorderWidth` — adicionadas (nao existiam no global)

## 4. Estilo DangerousButtonStyle completo

```xml
<Style x:Key="DangerousButtonStyle" TargetType="Button">
    <Setter Property="BackgroundColor" Value="Transparent" />
    <Setter Property="TextColor"
            Value="{AppThemeBinding
                Light={StaticResource DangerousActionColorLight},
                Dark={StaticResource DangerousActionColorDark}}" />
</Style>
```

**Propriedades sobrescritas:** apenas BackgroundColor e TextColor. Sem borda.

## 5. Variacoes de ColumnDefinitions

```xml
<!-- 2 colunas iguais -->
<Grid ColumnDefinitions="*,*">

<!-- 3 colunas iguais -->
<Grid ColumnDefinitions="*,*,*">

<!-- Primeira coluna 2x maior -->
<Grid ColumnDefinitions="2*,*">

<!-- Ultima coluna 2x maior -->
<Grid ColumnDefinitions="*,2*">
```

## 6. Estrutura completa da pagina de perfil (secao de botoes)

```xml
<VerticalStackLayout>
    <!-- ... avatar e campos acima ... -->

    <Grid ColumnDefinitions="*,*" ColumnSpacing="20" Margin="0,70,0,25">
        <Button Grid.Column="0"
                Text="{x:Static resources:AppResource.ChangePassword}"
                Style="{StaticResource SecondaryButtonStyle}" />
        <Button Grid.Column="1"
                Text="{x:Static resources:AppResource.UpdateProfile}" />
    </Grid>

    <Button Text="{x:Static resources:AppResource.DeleteMyAccount}"
            Style="{StaticResource DangerousButtonStyle}" />
</VerticalStackLayout>
```

## 7. Arquivo de recursos (AppResource)

Preparar antes de implementar:
```xml
<!-- PT-BR -->
<data name="ChangePassword"><value>Alterar Senha</value></data>
<data name="UpdateProfile"><value>Atualizar Perfil</value></data>
<data name="DeleteMyAccount"><value>Deletar Minha Conta</value></data>

<!-- EN -->
<data name="ChangePassword"><value>Change Password</value></data>
<data name="UpdateProfile"><value>Update Profile</value></data>
<data name="DeleteMyAccount"><value>Delete My Account</value></data>
```