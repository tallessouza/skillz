---
name: rs-csharp-maui-skeleton-animation
description: "Applies skeleton loading animation patterns when building .NET MAUI loading indicators. Use when user asks to 'create skeleton loader', 'add loading animation', 'implement shimmer effect', 'skeleton view', or 'loading placeholder' in .NET MAUI or Xamarin. Enforces opacity-based fade animation with proper easing curves, loop configuration, and Animation API usage. Make sure to use this skill whenever creating loading state UI components in .NET MAUI. Not for CSS/web animations, Lottie animations, or non-MAUI frameworks."
---

# Skeleton View Animation (.NET MAUI)

> Crie animacoes de skeleton loading usando a classe Animation com opacidade alternando em loop suave entre dois valores.

## Rules

1. **Use a classe Animation nativa** — instancie `new Animation()` e configure com `WithConcurrent`, porque e a API padrao do .NET MAUI para animacoes customizadas
2. **WithConcurrent executa em SEQUENCIA, nao em paralelo** — apesar do nome, cada chamada executa apos a anterior terminar, porque a ordem define o efeito visual
3. **Sempre crie DUAS configuracoes (ida e volta)** — a primeira aumenta opacidade (0.3→1), a segunda diminui (1→0.3), porque uma unica direcao causa "salto" visual ao reiniciar o loop
4. **Combine easings complementares** — use `SineIn` na ida (comeca devagar, acelera) e `SineOut` na volta (comeca rapido, desacelera), porque cria transicao natural e suave
5. **Extraia numeros magicos como constantes** — `AnimationDuration`, `AnimationRate`, porque `length: 1500` nao comunica "duracao da animacao em ms"
6. **Use `this.Animate()` para vincular ao componente** — o metodo Animate conecta a instancia Animation ao proprio BoxView, porque sem isso a animacao nao executa

## How to write

### SkeletonView completo

```csharp
public class SkeletonView : BoxView
{
    private const uint AnimationDuration = 1500; // milissegundos (1.5s)
    private const uint AnimationRate = 20;       // execucoes por segundo

    public SkeletonView()
    {
        BackgroundColor = Colors.LightGray;

        var smoothAnimation = new Animation();

        // Ida: opacidade 30% → 100%, aceleracao crescente
        smoothAnimation.WithConcurrent(
            f => Opacity = f,
            start: 0.3,
            end: 1,
            easing: Easing.SineIn
        );

        // Volta: opacidade 100% → 30%, aceleracao decrescente
        smoothAnimation.WithConcurrent(
            f => Opacity = f,
            start: 1,
            end: 0.3,
            easing: Easing.SineOut
        );

        this.Animate(
            name: "fadesInOut",
            animation: smoothAnimation,
            rate: AnimationRate,
            length: AnimationDuration,
            easing: Easing.SineIn,
            finished: null,
            repeat: () => true
        );
    }
}
```

## Example

**Before (animacao com salto visual):**
```csharp
// Apenas uma direcao — ao reiniciar o loop, pula de 100% para 30%
var anim = new Animation();
anim.WithConcurrent(f => Opacity = f, 0.3, 1, Easing.Linear);
this.Animate("fade", anim, length: 1000, repeat: () => true);
```

**After (animacao suave em loop):**
```csharp
var anim = new Animation();
anim.WithConcurrent(f => Opacity = f, 0.3, 1, Easing.SineIn);
anim.WithConcurrent(f => Opacity = f, 1, 0.3, Easing.SineOut);
this.Animate("fadesInOut", anim, rate: 20, length: 1500,
    easing: Easing.SineIn, finished: null, repeat: () => true);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Skeleton para texto (linhas) | BoxView com altura fixa, CornerRadius pequeno |
| Skeleton para imagem/avatar | BoxView com CornerRadius arredondado |
| Opacidade parece muito sutil | Aumente o range (ex: 0.1→1 ao inves de 0.3→1) |
| Animacao parece rapida demais | Aumente AnimationDuration (ex: 2000ms) |
| Animacao parece lenta/travada | Aumente AnimationRate (ex: 30) |
| Precisa parar a animacao | Use `this.AbortAnimation("fadesInOut")` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Uma unica direcao no loop | Duas configuracoes (ida + volta) |
| `Easing.Linear` para skeleton | `SineIn`/`SineOut` para naturalidade |
| Numeros magicos em `Animate()` | Constantes nomeadas (`AnimationDuration`) |
| `WithConcurrent` achando que e paralelo | Trate como sequencial — ordem importa |
| `repeat: () => false` para skeleton | `repeat: () => true` — skeleton e loop infinito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
