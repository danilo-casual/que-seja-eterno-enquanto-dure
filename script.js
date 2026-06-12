// ==========================================================================
// 1. CONFIGURAÇÃO DA DATA DO CASAL (Altere aqui se precisar ajustar o dia/mês)
// ==========================================================================
// Exemplo: Ano, Mês (0 para Janeiro, 1 para Fevereiro, etc), Dia, Hora, Minuto
const dataInicio = new Date(2022, 0, 1, 0, 0, 0); // Ajuste para a data exata de vocês se necessário

// ==========================================================================
// 2. INJEÇÃO DA MENSAGEM DE AMOR (LETRA)
// ==========================================================================
const mensagemAmor = `Viver ao seu lado tem sido meu bálsamo, conhecer um lado diferente seu todos os dias é meu motivo de euforia, nossos desencontros e encontros é o motivo para estarmos onde estamos atualmente, e sinceramente se pudesse, eu faria tudo de novo para nós acontecermos, viver contigo não é mais opção, é necessidade, você é quem dar cor a minha vida, e espero que seja quem irá pintar a história da minha vida ao meu lado, eu te amo muito karol e que seja eterno enquanto dure.

- Amor`;

// Injeta o texto no modal quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    const txtLetter = document.getElementById("full-love-letter");
    if (txtLetter) {
        txtLetter.textContent = mensagemAmor;
    }
    
    // Inicia o contador de tempo real
    atualizarContador();
    setInterval(atualizarContador, 1000);
});

// ==========================================================================
// 3. LÓGICA DO CONTADOR SEM NÚMEROS NEGATIVOS
// ==========================================================================
function atualizarContador() {
    const agora = new Date();
    
    let anos = agora.getFullYear() - dataInicio.getFullYear();
    let meses = agora.getMonth() - dataInicio.getMonth();
    let dias = agora.getDate() - dataInicio.getDate();
    
    // Ajuste para dias negativos (quando o dia atual é menor que o dia do aniversário)
    if (dias < 0) {
        const ultimoDiaMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
        meses--;
    }
    
    // Ajuste para meses negativos
    if (meses < 0) {
        meses += 12;
        anos--;
    }
    
    // Cálculo das horas, minutos e segundos restantes do dia atual
    const horas = agora.getHours();
    const minutos = agora.getMinutes();
    const segundos = agora.getSeconds();

    // Atualiza os elementos HTML da tela principal e do modal se existirem
    atualizarElementoDOM("years", anos);
    atualizarElementoDOM("months", meses);
    atualizarElementoDOM("days", dias);
    atualizarElementoDOM("hours", horas);
    atualizarElementoDOM("minutes", minutos);
    atualizarElementoDOM("seconds", segundos);
}

function atualizarElementoDOM(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        // Se o valor mudou, adiciona um leve efeito visual de rotação/pop
        if (elemento.textContent !== String(valor)) {
            elemento.textContent = valor;
            elemento.classList.add("pop-up-animation");
            setTimeout(() => elemento.classList.remove("pop-up-animation"), 250);
        }
    }
}

// ==========================================================================
// 4. CONTROLE DE TELAS (WRAPPED -> PLAYER)
// ==========================================================================
const btnVerPresente = document.getElementById("btn-ver-presente");
const wrappedScreen = document.getElementById("wrapped-screen");
const playerScreen = document.getElementById("player-screen");
const audioPlayer = document.getElementById("music-player");
const playIcon = document.getElementById("play-icon");
const modalPlayIcon = document.getElementById("modal-play-icon");

if (btnVerPresente) {
    btnVerPresente.addEventListener("click", () => {
        wrappedScreen.classList.remove("active");
        wrappedScreen.classList.add("hidden");
        playerScreen.classList.remove("hidden");
        playerScreen.classList.add("active");
        
        // Tenta dar o play automático na música ao abrir o presente
        audioPlayer.play().then(() => {
            alterarIconesPlay(true);
        }).catch(err => console.log("Play automático bloqueado pelo navegador. Usuário deve clicar no play."));
    });
}

// ==========================================================================
// 5. LÓGICA DE ABRIR E FECHAR O MODAL DA CARTA (LYRICS)
// ==========================================================================
const btnMostrarMensagem = document.getElementById("btn-mostrar-mensagem");
const btnFecharMensagem = document.getElementById("btn-fechar-mensagem");
const lyricsModal = document.getElementById("lyrics-modal");

if (btnMostrarMensagem) {
    btnMostrarMensagem.addEventListener("click", () => {
        lyricsModal.classList.remove("hidden-lyrics");
    });
}

if (btnFecharMensagem) {
    btnFecharMensagem.addEventListener("click", () => {
        lyricsModal.classList.add("hidden-lyrics");
    });
}

// ==========================================================================
// 6. CONTROLES DO PLAYER DE ÁUDIO (PLAY, PAUSE, PROGRESSO)
// ==========================================================================
const playPauseBtn = document.getElementById("play-pause-container");
const modalPlayPauseBtn = document.getElementById("modal-play-pause-container");
const progressBar = document.getElementById("progress-bar");
const modalProgressBar = document.getElementById("modal-progress-bar");
const currentTimeLabel = document.getElementById("current-time");
const totalTimeLabel = document.getElementById("total-time");
const modalCurrentTimeLabel = document.getElementById("modal-current-time");
const modalTotalTimeLabel = document.getElementById("modal-total-time");

function alterarIconesPlay(isPlaying) {
    if (isPlaying) {
        if (playIcon) playIcon.className = "fa-solid fa-pause";
        if (modalPlayIcon) modalPlayIcon.className = "fa-solid fa-pause";
    } else {
        if (playIcon) playIcon.className = "fa-solid fa-play";
        if (modalPlayIcon) modalPlayIcon.className = "fa-solid fa-play";
    }
}

function alternarAudio() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        alterarIconesPlay(true);
    } else {
        audioPlayer.pause();
        alterarIconesPlay(false);
    }
}

if (playPauseBtn) playPauseBtn.addEventListener("click", alternarAudio);
if (modalPlayPauseBtn) modalPlayPauseBtn.addEventListener("click", alternarAudio);

// Atualização das barras de progresso conforme a música toca
audioPlayer.addEventListener("timeupdate", () => {
    // Se o usuário estiver arrastando a barra, o evento timeupdate do áudio não deve sobrescrever a posição visual da barra
    if (isDragging) return;
    if (!audioPlayer.duration) return;
    
    const porcentagem = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    if (progressBar) progressBar.value = porcentagem;
    if (modalProgressBar) modalProgressBar.value = porcentagem;
    
    atualizarLabelsTempo(audioPlayer.currentTime, audioPlayer.duration);
});

// Formata e updates as strings de tempo na tela
function atualizarLabelsTempo(tempoAtual, tempoTotal) {
    const currentMin = Math.floor(tempoAtual / 60);
    const currentSec = Math.floor(tempoAtual % 60).toString().padStart(2, '0');
    
    const totalMin = Math.floor(tempoTotal / 60);
    const totalSec = Math.floor(tempoTotal % 60).toString().padStart(2, '0');
    
    if (currentTimeLabel) currentTimeLabel.textContent = `${currentMin}:${currentSec}`;
    if (modalCurrentTimeLabel) modalCurrentTimeLabel.textContent = `${currentMin}:${currentSec}`;
    
    if (totalTimeLabel) totalTimeLabel.textContent = `-${totalMin}:${totalSec}`;
    if (modalTotalTimeLabel) modalTotalTimeLabel.textContent = `-${totalMin}:${totalSec}`;
}

// ==========================================================================
// 7. REFINAMENTO DO ARRASTO SEM SOM ACELERADO (SILENCIOSO)
// ==========================================================================
let estavaTocando = false;
let isDragging = false;

function iniciarArrasto() {
    isDragging = true;
    estavaTocando = !audioPlayer.paused;
    if (estavaTocando) {
        audioPlayer.pause(); // Pausa temporariamente para silenciar o arrasto
    }
}

function sincronizarTimePorBarra(e) {
    if (!audioPlayer.duration) return;
    
    const valor = e.target.value;
    const novoTempo = (valor / 100) * audioPlayer.duration;
    
    // Atualiza o tempo do player (em silêncio)
    audioPlayer.currentTime = novoTempo;
    
    // Atualiza os números de tempo na tela enquanto arrasta para dar feedback visual
    atualizarLabelsTempo(novoTempo, audioPlayer.duration);
}

function finalizarArrasto() {
    isDragging = false;
    // Se a música estava tocando antes do clique, retoma o áudio na nova posição
    if (estavaTocando) {
        audioPlayer.play().then(() => {
            alterarIconesPlay(true);
        });
    }
}

// Vincula os eventos à barra principal
if (progressBar) {
    progressBar.addEventListener("mousedown", iniciarArrasto);
    progressBar.addEventListener("touchstart", iniciarArrasto);
    
    progressBar.addEventListener("input", sincronizarTimePorBarra);
    
    progressBar.addEventListener("change", finalizarArrasto);
    progressBar.addEventListener("touchend", finalizarArrasto);
}

// Vincula os mesmos eventos à barra interna do modal
if (modalProgressBar) {
    modalProgressBar.addEventListener("mousedown", iniciarArrasto);
    modalProgressBar.addEventListener("touchstart", iniciarArrasto);
    
    modalProgressBar.addEventListener("input", sincronizarTimePorBarra);
    
    modalProgressBar.addEventListener("change", finalizarArrasto);
    modalProgressBar.addEventListener("touchend", finalizarArrasto);
}

// ==========================================================================
// 8. COMPORTAMENTO AO TERMINAR A MÚSICA (REPLAY AUTOMÁTICO EM LOOP)
// ==========================================================================
audioPlayer.addEventListener("ended", () => {
    audioPlayer.currentTime = 0; // Reseta o tempo para o começo exato da faixa
    audioPlayer.play().then(() => {
        alterarIconesPlay(true); // Mantém o visual com o ícone de Pause ativo
    }).catch(err => {
        console.log("Erro ao dar replay automático:", err);
        alterarIconesPlay(false);
    });
});