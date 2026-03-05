# Code Examples: Introducao a Medidas de Dispersao

Esta aula e conceitual e nao contem codigo. Abaixo estao exemplos praticos que ilustram os conceitos ensinados.

## Demonstrando que mesma media esconde distribuicoes diferentes

```python
import numpy as np

# Dois datasets com a mesma media
concentrado = [9, 10, 10, 11, 10]
disperso = [2, 5, 10, 15, 18]

print(f"Media concentrado: {np.mean(concentrado)}")  # 10.0
print(f"Media disperso: {np.mean(disperso)}")          # 10.0

print(f"Desvio padrao concentrado: {np.std(concentrado):.2f}")  # 0.63
print(f"Desvio padrao disperso: {np.std(disperso):.2f}")        # 5.73

# Mesma media, dispersao completamente diferente
```

## Visualizando a diferenca

```python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].hist(concentrado, bins=5, edgecolor='black')
axes[0].axvline(np.mean(concentrado), color='red', linestyle='--', label='Media')
axes[0].set_title('Dados Concentrados')
axes[0].legend()

axes[1].hist(disperso, bins=5, edgecolor='black')
axes[1].axvline(np.mean(disperso), color='red', linestyle='--', label='Media')
axes[1].set_title('Dados Dispersos')
axes[1].legend()

plt.tight_layout()
plt.show()
```

## Caso de negocio: tempo de entrega

```python
# Cenario real onde a media engana
equipe_a = [3, 3, 3, 3, 3]     # Consistente
equipe_b = [1, 1, 1, 1, 11]    # Um outlier puxa a media

print(f"Equipe A - Media: {np.mean(equipe_a)} dias, Std: {np.std(equipe_a):.2f}")
# Media: 3.0, Std: 0.00

print(f"Equipe B - Media: {np.mean(equipe_b)} dias, Std: {np.std(equipe_b):.2f}")
# Media: 3.0, Std: 3.79

# Ambas tem media 3 dias, mas Equipe B tem um problema serio
# que so aparece quando olhamos a dispersao
```

## Checklist rapido para analise

```python
def analise_basica(dados, nome="Dataset"):
    """Sempre reporte media + dispersao juntos."""
    media = np.mean(dados)
    mediana = np.median(dados)
    std = np.std(dados)
    
    print(f"--- {nome} ---")
    print(f"Media: {media:.2f}")
    print(f"Mediana: {mediana:.2f}")
    print(f"Desvio Padrao: {std:.2f}")
    print(f"Coef. Variacao: {(std/media)*100:.1f}%")
    
    if abs(media - mediana) > std * 0.5:
        print("⚠ Media e mediana divergem — possivel assimetria ou outliers")
    if std > media * 0.5:
        print("⚠ Alta dispersao — media pode nao ser representativa")

analise_basica(concentrado, "Concentrado")
analise_basica(disperso, "Disperso")
```