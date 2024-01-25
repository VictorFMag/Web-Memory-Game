const imagensCartas = ['./images/bolinho.png', './images/frango.png', './images/hamburguer.png', './images/hotdog.png'];
const tabuleiro = document.getElementById('tabuleiro');

let cartas = []; // Armazena as cartas do jogo
let cartasViradas = []; // Armazena as cartas atualmente viradas
let contadorDeParesDescobertos = 0; // Contador de pares de cartas que já foram descobertos

const vidasDisplay = document.getElementById('vidas');
const tentativasDisplay = document.getElementById('tentativas');
let vidas = 3; // Número inicial de vidas
let tentativas = 0; // Número inicial de tentativas

// Cria a carta com base no índice da imagem passada como parâmetro
function criarCarta(imagemIndex) {
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.dataset.imagemIndex = imagemIndex;
    const img = document.createElement('img');
    img.src = imagensCartas[imagemIndex];
    carta.appendChild(img);
    carta.addEventListener('click', () => virarCarta(carta));
    return carta;
}

// Embaralha o array de cartas para garantir que a disposição das cartas mude a cada novo jogo
function embaralharCarta(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Vira a carta e verifica se ela forma um par
function virarCarta(carta) {
    if (cartasViradas.length < 2 && !cartasViradas.includes(carta) && !carta.classList.contains('virada')) {
        carta.classList.add('virada');
        const img = carta.querySelector('img');
        img.style.visibility = 'visible';
        img.style.transform = 'scale(0.8)';
        cartasViradas.push(carta);

        if (cartasViradas.length === 2) { // Verifica se tem outra carta já virada
            tentativas++;
            tentativasDisplay.textContent = tentativas;
            setTimeout(() => {
                verificarPar();
            }, 500);
        }
    }
}

// Verifica se o número de pares formados é o suficiente para vencer o jogo
function verificarVitoria() {
    if (contadorDeParesDescobertos === 8) {
        alert('Parabéns! Você venceu o jogo!');
        reiniciarJogo();
    }
}

// Verifica se as duas cartas que estão viradas formam um par
// Se sim, registra isso, deixa o par revelado e verifica se o jogador venceu
// Senão, vira esconde as cartas denovo
function verificarPar() {
    const [carta1, carta2] = cartasViradas;
    if (carta1.dataset.imagemIndex === carta2.dataset.imagemIndex) {
        cartasViradas = [];
        cartas = cartas.filter((c) => c !== carta1 && c !== carta2);
        contadorDeParesDescobertos += 2;
        console.log(contadorDeParesDescobertos);
        verificarVitoria();
    } else {
        cartasViradas.forEach((carta) => {
            carta.classList.remove('virada');
            const img = carta.querySelector('img');
            img.style.visibility = 'hidden';
            img.style.transform = 'scale(0)';
        });
        cartasViradas = [];
        vidas--;
        vidasDisplay.textContent = vidas;
        if (vidas === 0) {
            alert('Você perdeu o jogo!');
            reiniciarJogo();
        }
    }
}

// Zera o progresso e embaralha novamente as cartas
function reiniciarJogo() {
    tabuleiro.innerHTML = '';
    cartas.length = 0;
    cartasViradas.length = 0;
    vidas = 3;
    vidasDisplay.textContent = vidas;
    tentativas = 0;
    tentativasDisplay.textContent = tentativas;
    contadorDeParesDescobertos = 0; // Zerar o contador de cartas viradas
    iniciarJogo();
}

function iniciarJogo() {
    const indicesImagens = [...Array(imagensCartas.length).keys()].flatMap((i) => [i, i]);
    embaralharCarta(indicesImagens);
    for (let i = 0; i < indicesImagens.length; i++) {
        const carta = criarCarta(indicesImagens[i]);
        tabuleiro.appendChild(carta);
        cartas.push(carta);
    }

    for (const carta of cartas) {
        const img = carta.querySelector('img');
        img.style.visibility = 'visible';
        img.style.transform = 'scale(0.8)';
        carta.classList.add('virada');
    }

    setTimeout(() => {
        for (const carta of cartas) {
            const img = carta.querySelector('img');
            img.style.visibility = 'hidden';
            img.style.transform = 'scale(0)';
            carta.classList.remove('virada');
        }
    }, 3000); // Virar as cartas para baixo após 3 segundos
}

document.addEventListener('DOMContentLoaded', iniciarJogo); // Inicia o jogo quando o conteúdo da página é carregado