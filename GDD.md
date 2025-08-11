# Game Design Document (GDD) - Mago da Floresta

## 1. Visão Geral

**Nome do Jogo:** Magic Tactic

**Gênero:** RPG de Estratégia por Turnos com elementos de Aventura.

**Plataforma:** Web (HTML, CSS, JavaScript).

**Conceito:** Um jogo onde o jogador assume o papel de um mago em uma floresta encantada, utilizando feitiços baseados em elementos para combater inimigos e um chefe final, em um sistema de combate similar a Pokémon.

**Público Alvo:** Jogadores casuais e fãs de RPGs clássicos 2D.

## 2. Mecânicas de Jogo

### 2.1. Combate

O combate será por turnos, onde o jogador e o inimigo se revezam para atacar. O sistema de elementos seguirá uma lógica de 


vantagem/desvantagem (ex: Fogo > Água, Água > Fogo, etc.).

**Elementos:**
- Fogo
- Água
- Terra
- Ar
- Luz
- Trevas

**Feitiços:** Cada elemento terá uma variedade de feitiços com diferentes efeitos (dano, cura, status, etc.). Exemplos:
- **Fogo:** Bola de Fogo (dano), Parede de Fogo (defesa)
- **Água:** Jato de Água (dano), Cura Aquática (cura)
- **Terra:** Terremoto (dano em área), Escudo de Pedra (defesa)
- **Ar:** Rajada de Vento (dano), Velocidade do Vento (aumento de velocidade)
- **Luz:** Raio de Luz (dano), Cura Divina (cura)
- **Trevas:** Bola Sombria (dano), Maldição (status negativo)

**Sistema de Turnos:**
1. O jogador escolhe uma ação (atacar, usar item, fugir).
2. O inimigo escolhe uma ação.
3. As ações são executadas com base na velocidade dos personagens.

### 2.2. Mapa e Exploração

O jogo terá um mapa 2D, com visão de cima para baixo, similar aos jogos clássicos de Pokémon. O jogador poderá se mover livremente pelo mapa, seguindo um caminho pré-definido. Inimigos serão visíveis no mapa e o combate será iniciado ao entrar em contato com eles.

**Locais:**
- Floresta Encantada (área principal)
- Caverna Sombria (esconderijo do chefe)

**Inimigos:**
- 5 Magos Negros (inimigos comuns, com diferentes elementos)
- Rei das Trevas (chefe final, mais forte e com feitiços de Trevas)

### 2.3. Sistema de Nível e Pontos

O jogador ganhará experiência ao derrotar inimigos. Ao atingir um novo nível, o jogador receberá pontos para distribuir em atributos como:
- **Vida:** Aumenta a saúde máxima do mago.
- **Mana:** Aumenta a mana máxima para usar feitiços.
- **Ataque Mágico:** Aumenta o dano dos feitiços.
- **Defesa Mágica:** Reduz o dano recebido de feitiços inimigos.
- **Velocidade:** Aumenta a chance de agir primeiro no combate.

## 3. Interface do Usuário (UI)

### 3.1. HUD (Head-Up Display)

Durante o combate, a HUD exibirá:
- Barra de Vida do jogador e do inimigo.
- Barra de Mana do jogador.
- Nome do feitiço atual.
- Opções de ação (Atacar, Item, Fugir).

### 3.2. Menus

- **Menu Principal:** Iniciar Jogo, Opções, Sair.
- **Menu de Inventário:** Exibir itens coletados.
- **Menu de Habilidades:** Exibir feitiços aprendidos e permitir a distribuição de pontos de atributo.

## 4. Assets

### 4.1. Visuais

- Sprites do jogador (mago), inimigos, chefe.
- Tilesets para o mapa (árvores, grama, pedras, água).
- Efeitos visuais para feitiços.

### 4.2. Áudio

- Músicas de fundo (exploração, combate, vitória).
- Efeitos sonoros para feitiços, ataques, interações.

## 5. Tecnologia

- **Linguagens:** HTML, CSS, JavaScript.
- **Hospedagem:** GitHub Pages (para testes iniciais).

## 6. Próximos Passos

- Detalhar a lógica de cada feitiço.
- Criar os sprites e tilesets iniciais.
- Implementar o sistema de movimento do jogador.
- Desenvolver a tela de combate básica.




## 7. Melhorias Visuais (Atualização)

### 7.1. Mapa

O mapa será expandido para incluir diferentes áreas com transições visuais:

- **Floresta Inicial (Casa do Mago):** Árvores mais detalhadas e bonitas, grama mais densa, iluminação suave e confortável, rochas espalhadas. Ambiente acolhedor e natural.
- **Floresta Destruída (Área dos Inimigos):** Transição para uma área com árvores cortadas, tocos, talvez um solo mais árido ou com marcas de destruição. O ambiente deve transmitir uma sensação de desolação e perigo.
- **Covil do Rei das Trevas (Área do Chefe):** Uma área onde as trevas são dominantes, com elementos visuais que remetem à escuridão e ao poder do chefe. Pode incluir estruturas sombrias, iluminação mínima e efeitos de névoa ou fumaça.

### 7.2. Personagens

- **Mago (Jogador):** O personagem terá um corpo completo, com um visual que remete ao Mario (corpo pequeno, mas expressivo). Vestes de mago que transmitam bravura (ex: capa esvoaçante, cores vibrantes, detalhes em dourado ou prata). Terá uma varinha como arma.
- **Magos Negros (Inimigos):** Vão ter vestes negras e um visual mais robusto, transmitindo uma sensação de ameaça.
- **Rei das Trevas (Chefe Final):** Será maior e mais intimidador que os magos negros comuns. Seu design deve refletir seu poder e a dominância das trevas, com detalhes que o tornem visualmente imponente.

### 7.3. Efeitos de Batalha

Durante as batalhas, serão implementados efeitos visuais para os ataques e feitiços, tornando-os mais dinâmicos e impactantes. Isso inclui:

- **Animações de Feitiços:** Efeitos visuais para Bola de Fogo (chamas), Jato de Água (água jorrando), Cura Divina (brilho, partículas de luz), etc.
- **Animações de Ataque/Dano:** Pequenas animações quando o jogador ou inimigo ataca/recebe dano.
- **Sprites de Batalha:** Os sprites dos personagens e inimigos na tela de batalha serão mais detalhados e animados, mostrando o corpo completo do mago e dos inimigos.
- **Fundos de Batalha:** O fundo da tela de batalha pode variar dependendo da área do mapa onde o combate é iniciado (floresta normal, floresta destruída, covil do chefe).

## 8. Sugestões Adicionais

- **Partículas:** Adicionar efeitos de partículas para feitiços e interações.
- **Sons:** Implementar efeitos sonoros para cada feitiço e ação de combate.
- **Música:** Adicionar trilhas sonoras diferentes para exploração e combate.
- **Interface:** Refinar a interface do usuário com ícones e elementos visuais mais polidos.


