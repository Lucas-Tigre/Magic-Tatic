# Magic Tactic

Um jogo de RPG por turnos onde você é um mago explorando uma floresta encantada, enfrentando inimigos usando feitiços baseados em elementos.

## 🎮 Como Jogar

### Controles
- **Setas do teclado** ou **WASD**: Mover o mago pelo mapa
- **Mouse**: Interagir com menus e botões

### Objetivo
- Derrote todos os 5 Magos Negros espalhados pelo mapa
- Após derrotar todos, o caminho para o **Rei das Trevas** (chefe final) será liberado
- Vença o Rei das Trevas para completar o jogo

### Sistema de Combate
- **Por turnos**: Você e o inimigo se alternam para atacar
- **Elementos**: Cada feitiço tem um elemento com vantagens/desvantagens
  - Fogo > Água
  - Água > Terra  
  - Terra > Ar
  - Ar > Fogo
  - Luz ↔ Trevas (se anulam)

### Feitiços Iniciais
- **Bola de Fogo** (Fogo): 15 de dano, custa 8 MP
- **Jato de Água** (Água): 12 de dano, custa 6 MP  
- **Cura Divina** (Luz): Cura 20 HP, custa 10 MP

### Sistema de Níveis
- Ganhe experiência derrotando inimigos
- Ao subir de nível, distribua pontos em:
  - **Vida**: Aumenta HP máximo
  - **Mana**: Aumenta MP máximo
  - **Ataque Mágico**: Aumenta dano dos feitiços
  - **Defesa Mágica**: Reduz dano recebido
  - **Velocidade**: Aumenta chance de agir primeiro

## 🗺️ Áreas do Jogo

### Floresta Inicial
- **Ambiente**: Floresta encantada com árvores exuberantes e grama densa
- **Características**: Iluminação suave e confortável, rochas com musgo
- **Função**: Área de início, casa do mago herói

### Floresta Destruída  
- **Ambiente**: Área devastada com árvores cortadas e solo árido
- **Características**: Tocos de árvores, terra rachada, atmosfera desolada
- **Função**: Onde estão localizados os 5 Magos Negros

### Covil das Trevas
- **Ambiente**: Área sombria dominada pelas trevas
- **Características**: Pedras negras, runas roxas brilhantes, atmosfera ominosa
- **Função**: Lar do Rei das Trevas (chefe final)

## 🎨 Recursos Visuais

### Sprites Detalhados
- **Mago Herói**: Sprite completo com varinha e vestes corajosas
- **Magos Negros**: Sprites robustos com vestes negras intimidadoras  
- **Rei das Trevas**: Sprite maior e mais imponente

### Tilesets Ricos
- **Grama**: Textura densa e natural
- **Árvores**: Variadas entre saudáveis e mortas
- **Rochas**: Com detalhes de musgo e desgaste
- **Elementos Sombrios**: Pedras negras com runas místicas

### Efeitos Visuais
- **Feitiços**: Animações específicas para cada elemento
- **Fundos de Batalha**: Cenários dinâmicos que mudam por área
- **Interface**: Barras de vida/mana com gradientes suaves

## 📁 Estrutura do Projeto

```
game/
├── index.html              # Arquivo principal
├── css/
│   └── style.css           # Estilos do jogo
├── js/
│   ├── game.js             # Versão original
│   └── enhanced-game.js    # Versão aprimorada (atual)
├── assets/
│   ├── images/             # Sprites, tilesets e fundos
│   │   ├── player_wizard_sprite.png
│   │   ├── dark_wizard_sprite.png
│   │   ├── dark_king_sprite.png
│   │   ├── forest_tree_tile.png
│   │   ├── grass_tile.png
│   │   ├── rock_tile.png
│   │   ├── dead_tree_tile.png
│   │   ├── barren_ground_tile.png
│   │   ├── dark_ground_tile.png
│   │   ├── dark_pillar_tile.png
│   │   ├── fire_spell_effect.png
│   │   ├── water_spell_effect.png
│   │   ├── heal_spell_effect.png
│   │   ├── battle_bg_forest.png
│   │   ├── battle_bg_destroyed_forest.png
│   │   └── battle_bg_dark_lair.png
│   └── audio/              # Áudio (para futuras expansões)
├── GDD.md                  # Documento de Design do Jogo
├── README.md               # Este arquivo
└── CHANGELOG.md            # Histórico de mudanças
```

## 🚀 Como Executar

1. Abra o arquivo `index.html` em qualquer navegador web moderno
2. Clique em "Iniciar Jogo" para começar
3. Use "Instruções" para ver as regras detalhadas

## 💻 Tecnologias Utilizadas

- **HTML5**: Estrutura da página e Canvas para o mapa
- **CSS3**: Estilização e animações
- **JavaScript**: Lógica do jogo, sistema de combate e interações

## ✅ Recursos Implementados

### Versão 2.0 (Atual)
✅ Sistema de áreas com diferentes ambientes  
✅ Sprites detalhados para todos os personagens  
✅ Tilesets ricos para cada tipo de terreno  
✅ Efeitos visuais para feitiços  
✅ Fundos de batalha dinâmicos por área  
✅ Sistema de carregamento de assets  

### Versão 1.0
✅ Sistema de movimento livre no mapa  
✅ Combate por turnos com sistema de elementos  
✅ Sistema de níveis e distribuição de pontos  
✅ Interface responsiva para desktop e mobile  
✅ Múltiplas telas (menu, jogo, combate, level up)  
✅ Sistema de feitiços com custos de mana  
✅ Inimigos com diferentes elementos e estatísticas  
✅ Chefe final desbloqueável  

## 🔮 Possíveis Expansões Futuras

- Sistema de placar/ranking
- Mais feitiços e elementos
- Itens e equipamentos
- Múltiplas áreas/mapas
- Efeitos sonoros e música
- Animações mais elaboradas
- Sistema de save/load
- Modo multiplayer

---

**Desenvolvido como um projeto de demonstração de game development web com foco em melhorias visuais e experiência do usuário.**

