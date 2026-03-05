# Deep Explanation: Espaçamento em .NET MAUI

## O modelo mental de spacing + delta

O instrutor apresenta uma abordagem elegante para gerenciar espaçamentos em layouts MAUI: em vez de definir margens individuais em cada elemento, você define um **spacing base** no `VerticalStackLayout` e depois faz **ajustes pontuais** com margens nos elementos que precisam de espaçamento diferente.

### A matemática é simples

```
Espaçamento final = Spacing do layout + Margin do elemento
```

Exemplos concretos da aula:
- **Design pede 30px** → Spacing=30, Margin=0 (nada a fazer)
- **Design pede 20px** → Spacing=30, Margin=-10 (30-10=20)
- **Design pede 40px** → Spacing=30, Margin=+10 (30+10=40)
- **Design pede 70px** → Spacing=30, Margin=+40 (30+40=70)

### Por que margens negativas funcionam

O .NET MAUI aceita valores negativos na propriedade `Margin`. Quando o `VerticalStackLayout` adiciona 30px entre dois elementos e o elemento tem `Margin="0,-10,0,0"`, o resultado visual é 20px de distância. O motor de layout simplesmente soma os valores.

### Por que não usar Spacing=0 e margens individuais?

Porque a maioria dos elementos no design compartilha o mesmo espaçamento base (30px neste caso). Definir no pai elimina repetição e torna ajustes futuros triviais — mude um número em vez de dezenas.

## A importância do espaçamento para touch targets

O instrutor faz um alerta prático: em apps mobile, o usuário usa o dedo para interagir. Elementos clicáveis muito próximos causam toques acidentais, especialmente "num ato de pressa". A recomendação é:

- **Mínimo 30px** entre elementos clicáveis consecutivos
- Não exagerar (100px é demais)
- Não economizar (10-20px é pouco)

Isso é uma regra de UX mobile, não apenas estética.

## Workflow de conferência com Figma

O instrutor demonstra a técnica de **Alt+hover** no Figma:
1. Selecione um elemento no Figma
2. Segure a tecla Alt
3. Passe o mouse sobre outro elemento
4. O Figma mostra a distância exata em pixels

Isso permite conferir rapidamente todos os espaçamentos do design sem precisar abrir propriedades ou medir manualmente.

## Reutilização de componentes na tela de login

A tela de login reutiliza os mesmos componentes criados anteriormente (`EntryLabelComponent` para e-mail, `EntryLabelPasswordComponent` para senha), demonstrando o valor de componentização — a tela de login foi montada apenas declarando os componentes no XAML com as props corretas.