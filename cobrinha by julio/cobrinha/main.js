document.addEventListener('DOMContentLoaded', () => {
  // Configurações do jogo
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const gridSize = 20;
  const gridWidth = canvas.width / gridSize;
  const gridHeight = canvas.height / gridSize;
  const novoJogoButton = document.getElementById('novo_jogo');

// Adicionar o manipulador de eventos ao botão
  novoJogoButton.addEventListener('click', function() {
  location.reload();
  });

  // Estado do jogo
  let snake = [{ x: 24, y: 20 }];
  let direction = 'down';
  let score = 0;
  let timeLeft = 60; // Tempo em milisegundos
  let food = generateFood(); // Comida da cobrinha

  // Função para atualizar o estado do jogo
  function update() {
    // Movimentar a cobrinha
    const head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }

    // Verificar colisão com as bordas do tabuleiro
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
      gameOver();
      return;
    }

    // Verificar colisão com a própria cobrinha
    if (snake.some(segment => segment.x === head.x && segment.y === head.y && segment !== head)) {
      gameOver();
      return;
    }

    // Verificar colisão com a comida
    if (head.x === food.x && head.y === food.y) {
      // Aumentar o tamanho da cobrinha
      snake.push({ x: food.x, y: food.y });
      // Incrementar o score
      score++;
      timeLeft= timeLeft + 50;
      
      // Gerar nova comida
      food = generateFood();
    } else {
      // Remover a cauda da cobrinha se não houver colisão com a comida
      snake.pop();
    }

    snake.unshift(head);

    // Limpar o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a cobrinha
    context.fillStyle = 'yellow';
    snake.forEach(segment => {
      context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Desenhar a comida
    context.fillStyle = 'red';
    context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Atualizar o contador de tempo
    timeLeft = timeLeft - 1;
    

    // Verificar se o tempo acabou
    if (timeLeft <= 0) {
      gameOver();
      return;
    }

    // Atualizar o contador de tempo na tela
    document.getElementById('time').textContent = timeLeft;

    // Atualizar o contador de pontos (score) na tela
    document.getElementById('score').textContent = score;

    // Agendar a próxima atualização
    setTimeout(update, 1000 / 8);
  }

  // Função para gerar uma nova posição para a comida
  function generateFood() {
    return {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
  }

  // Função para lidar com as teclas pressionadas
  function handleKeyPress(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction !== 'down') {
      direction = 'up';
    } else if (key === 'ArrowDown' && direction !== 'up') {
      direction = 'down';
    } else if (key === 'ArrowLeft' && direction !== 'right') {
      direction = 'left';
    } else if (key === 'ArrowRight' && direction !== 'left') {
      direction = 'right';
    }
  }

  // Função para encerrar o jogo
  function gameOver() {
    // Limpar o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Exibir mensagem de fim de jogo
    context.fillStyle = 'red';
    context.font = '80px Arial';
    context.fillText('Fim de Jogo!', canvas.width / 2.7 - 100, canvas.height / 2);
  }

  // Adicionar o evento de pressionar tecla
  document.addEventListener('keydown', handleKeyPress);

  // Iniciar o jogo
  update();
});
 