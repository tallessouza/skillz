# Code Examples: Skeleton View Animation

## Exemplo 1: SkeletonView basico (do instrutor)

```csharp
public class SkeletonView : BoxView
{
    private const uint AnimationDuration = 1500;
    private const uint AnimationRate = 20;

    public SkeletonView()
    {
        // Cor fixa definida na aula anterior
        BackgroundColor = Colors.LightGray;

        // 1. Criar instancia da animacao
        var smoothAnimation = new Animation();

        // 2. Configurar ida (0.3 → 1.0, aceleracao crescente)
        smoothAnimation.WithConcurrent(
            f => Opacity = f,    // f e um double alterado ao longo do tempo
            start: 0.3,          // 30% de opacidade
            end: 1,              // 100% de opacidade
            easing: Easing.SineIn // comeca devagar, acelera
        );

        // 3. Configurar volta (1.0 → 0.3, aceleracao decrescente)
        smoothAnimation.WithConcurrent(
            f => Opacity = f,
            start: 1,
            end: 0.3,
            easing: Easing.SineOut // comeca rapido, desacelera
        );

        // 4. Vincular animacao ao componente
        this.Animate(
            name: "fadesInOut",
            animation: smoothAnimation,
            rate: AnimationRate,
            length: AnimationDuration,
            easing: Easing.SineIn,
            finished: null,
            repeat: () => true   // loop infinito
        );
    }
}
```

## Exemplo 2: Variacao — skeleton mais sutil

```csharp
// Opacidade com range menor para efeito mais discreto
smoothAnimation.WithConcurrent(f => Opacity = f, 0.5, 0.9, Easing.SineIn);
smoothAnimation.WithConcurrent(f => Opacity = f, 0.9, 0.5, Easing.SineOut);
```

## Exemplo 3: Variacao — skeleton mais dramatico

```csharp
// Range completo para efeito mais visivel
smoothAnimation.WithConcurrent(f => Opacity = f, 0.1, 1, Easing.SineIn);
smoothAnimation.WithConcurrent(f => Opacity = f, 1, 0.1, Easing.SineOut);
```

## Exemplo 4: Variacao — animacao mais lenta (2.5s)

```csharp
private const uint AnimationDuration = 2500;

this.Animate(
    name: "fadesInOut",
    animation: smoothAnimation,
    rate: AnimationRate,
    length: AnimationDuration,
    easing: Easing.SineIn,
    finished: null,
    repeat: () => true
);
```

## Exemplo 5: Parar a animacao quando dados carregarem

```csharp
public void StopLoading()
{
    this.AbortAnimation("fadesInOut");
    Opacity = 1; // restaurar opacidade total
}
```

## Exemplo 6: Uso em XAML

```xml
<!-- Skeleton para texto -->
<local:SkeletonView HeightRequest="16" WidthRequest="200"
                    CornerRadius="4" Margin="0,4" />

<!-- Skeleton para avatar -->
<local:SkeletonView HeightRequest="48" WidthRequest="48"
                    CornerRadius="24" />

<!-- Skeleton para card -->
<local:SkeletonView HeightRequest="120" WidthRequest="300"
                    CornerRadius="8" />
```

## Exemplo 7: Easing Linear vs SineIn/Out (comparacao)

```csharp
// LINEAR: velocidade constante — parece mecanico
smoothAnimation.WithConcurrent(f => Opacity = f, 0.3, 1, Easing.Linear);
smoothAnimation.WithConcurrent(f => Opacity = f, 1, 0.3, Easing.Linear);

// SINE: velocidade variavel — parece natural ("respirando")
smoothAnimation.WithConcurrent(f => Opacity = f, 0.3, 1, Easing.SineIn);
smoothAnimation.WithConcurrent(f => Opacity = f, 1, 0.3, Easing.SineOut);
```