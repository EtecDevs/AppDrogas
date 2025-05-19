// Importando Howler.js e anime.js
const { Howl } = window
const anime = window.anime

// Preload assets
document.addEventListener("DOMContentLoaded", () => {
  preloadAssets()
})

// Sound effects configuration
const sounds = {
  click: new Howl({
    src: ["https://assets.codepen.io/21542/click.mp3"],
    volume: 0.5,
    preload: true,
  }),
  hover: new Howl({
    src: ["https://assets.codepen.io/21542/hover.mp3"],
    volume: 0.3,
    preload: true,
  }),
  start: new Howl({
    src: ["https://assets.codepen.io/21542/start.mp3"],
    volume: 0.7,
    preload: true,
  }),
  option: new Howl({
    src: ["https://assets.codepen.io/21542/option.mp3"],
    volume: 0.5,
    preload: true,
  }),
  transition: new Howl({
    src: ["https://assets.codepen.io/21542/transition.mp3"],
    volume: 0.6,
    preload: true,
  }),
  result: new Howl({
    src: ["https://assets.codepen.io/21542/result.mp3"],
    volume: 0.7,
    preload: true,
  }),
}

// Dados do quiz
const quizData = [
  {
    question: "Qual elemento você controlaria?",
    options: ["Fogo - destrutivo mas poderoso", "Água - adaptável e fluido", "Ar - livre e veloz"],
  },
  {
    question: "Como você usaria seus poderes?",
    options: ["Para proteger os inocentes", "Para adquirir conhecimento", "Para explorar o desconhecido"],
  },
  {
    question: "Qual característica você valoriza mais?",
    options: ["Força e resistência", "Inteligência e estratégia", "Velocidade e agilidade"],
  },
]

// Resultados possíveis
const results = [
  {
    power: "Telecinese Quântica",
    description:
      "Você pode manipular a matéria em nível quântico, movendo objetos com o poder da mente e alterando sua estrutura molecular. Este poder permite que você desmonte e remonte objetos à vontade, criando novas formas e materiais nunca antes vistos.",
  },
  {
    power: "Controle Mental",
    description:
      "Sua mente é capaz de influenciar pensamentos, criar ilusões e até mesmo controlar as ações de outros seres. Você pode projetar imagens diretamente na mente de outras pessoas e manipular suas percepções da realidade.",
  },
  {
    power: "Supervelocidade",
    description:
      "Você pode se mover em velocidades incríveis, quase como se o tempo desacelerasse ao seu redor, permitindo reflexos sobre-humanos. Seu corpo gera um campo de energia que o protege dos efeitos da fricção e permite que você percorra grandes distâncias em segundos.",
  },
  {
    power: "Manipulação Temporal",
    description:
      "Você consegue alterar o fluxo do tempo, desacelerando, acelerando ou até mesmo parando momentaneamente o tempo ao seu redor. Este poder permite que você veja possíveis futuros e altere eventos passados dentro de um limite restrito.",
  },
  {
    power: "Regeneração Avançada",
    description:
      "Seu corpo possui capacidade de cura acelerada, permitindo que você se recupere de quase qualquer ferimento em questão de segundos. Além disso, você envelhece mais lentamente e seu sistema imunológico é praticamente invencível contra doenças.",
  },
  {
    power: "Projeção Astral",
    description:
      "Sua consciência pode se separar do corpo físico, permitindo que você viaje através de dimensões e observe eventos distantes. Durante a projeção, você pode atravessar objetos sólidos e se comunicar com outras entidades em diferentes planos de existência.",
  },
]

// Variáveis de estado
let currentQuestion = 0
let userAnswers = []
let isTransitioning = false
let assetsLoaded = false

// Elementos DOM
const preloader = document.getElementById("preloader")
const startScreen = document.getElementById("start-screen")
const quizScreen = document.getElementById("quiz-screen")
const resultScreen = document.getElementById("result-screen")
const questionsWrapper = document.getElementById("questions-wrapper")
const mainTitle = document.getElementById("main-title")
const startButton = document.getElementById("start-button")
const powerResult = document.getElementById("power-result")
const powerDescription = document.getElementById("power-description")
const shareButton = document.getElementById("share-button")
const restartButton = document.getElementById("restart-button")
const progressFill = document.querySelector(".progress-fill")
const currentQuestionEl = document.getElementById("current-question")

// Função para simular carregamento
function preloadAssets() {
  // Create progress animation
  const progressBar = document.querySelector("#preloader .progress-bar")

  // Simulate loading progress
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 10
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)

      // Mark assets as loaded
      assetsLoaded = true

      // Complete the preloader animation
      setTimeout(() => {
        finishPreloader()
      }, 500)
    }

    // Update progress bar
    progressBar.style.width = `${progress}%`
  }, 200)

  // Animate loader circle
  anime({
    targets: ".loader-circle",
    rotate: "1turn",
    duration: 1500,
    loop: true,
    easing: "linear",
  })

  // Create background elements
  createBackgroundElements()
}

// Create background elements
function createBackgroundElements() {
  const glowOrbs = document.querySelector(".glow-orbs")

  // Create glow orbs
  for (let i = 0; i < 5; i++) {
    const orb = document.createElement("div")
    orb.classList.add("glow-orb")

    // Random size between 200px and 400px
    const size = Math.random() * 200 + 200
    orb.style.width = `${size}px`
    orb.style.height = `${size}px`

    // Random position
    orb.style.left = `${Math.random() * 100}%`
    orb.style.top = `${Math.random() * 100}%`

    // Random color (cyan or purple)
    const color = Math.random() > 0.5 ? "var(--cyan)" : "var(--purple)"
    orb.style.background = color

    glowOrbs.appendChild(orb)

    // Animar orb
    anime({
      targets: orb,
      translateX: () => anime.random(-100, 100),
      translateY: () => anime.random(-100, 100),
      scale: [0.8, 1.2],
      opacity: [0.1, 0.2],
      duration: () => anime.random(15000, 30000),
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })
  }
}

// Função para finalizar o preloader e mostrar a tela inicial
function finishPreloader() {
  anime({
    targets: preloader,
    opacity: 0,
    duration: 800,
    easing: "easeOutQuad",
    complete: () => {
      preloader.style.display = "none"
      initStartScreen()
    },
  })
}

// Inicializar tela inicial com animações
function initStartScreen() {
  // Animação do título
  anime
    .timeline({
      easing: "easeOutExpo",
    })
    .add({
      targets: mainTitle,
      opacity: [0, 1],
      scale: [0.8, 1],
      translateY: [30, 0],
      duration: 1200,
    })
    .add({
      targets: ".title-underline",
      width: [0, "80%"],
      duration: 800,
      offset: "-=800",
    })
    .add({
      targets: ".subtitle",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      offset: "-=600",
    })
    .add({
      targets: startButton,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      offset: "-=600",
      complete: () => {
        // Animação pulsante do botão iniciar
        anime({
          targets: startButton,
          boxShadow: [
            "0 0 15px rgba(0, 255, 255, 0.7)",
            "0 0 25px rgba(0, 255, 255, 0.9)",
            "0 0 15px rgba(0, 255, 255, 0.7)",
          ],
          scale: [1, 1.05, 1],
          duration: 2000,
          loop: true,
          easing: "easeInOutQuad",
        })
      },
    })

  // Adicionar event listeners
  startButton.addEventListener("click", startQuiz)

  // Adicionar som ao hover nos botões
  document.querySelectorAll(".neon-button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      sounds.hover.play()
    })
  })
}

// Iniciar quiz
function startQuiz() {
  if (isTransitioning) return
  isTransitioning = true

  sounds.start.play()

  // Reset quiz state
  currentQuestion = 0
  userAnswers = []

  // Preparar perguntas do quiz
  prepareQuizQuestions()

  // Transição para tela de quiz
  anime
    .timeline({
      easing: "easeOutQuad",
    })
    .add({
      targets: startScreen,
      opacity: 0,
      translateY: -30,
      duration: 800,
      complete: () => {
        startScreen.classList.add("hidden")
        quizScreen.classList.remove("hidden")
      },
    })
    .add({
      targets: quizScreen,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      complete: () => {
        // Mostrar primeira pergunta
        showQuestion(0)
        isTransitioning = false
      },
    })
    .add({
      targets: ".progress-indicator",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      offset: "-=400",
    })
}

// Preparar perguntas do quiz
function prepareQuizQuestions() {
  // Clear previous questions
  questionsWrapper.innerHTML = ""

  // Criar todas as perguntas
  quizData.forEach((questionData, index) => {
    const questionElement = document.createElement("div")
    questionElement.classList.add("question")
    questionElement.dataset.index = index.toString()

    // Only make the first question active initially
    if (index === 0) {
      questionElement.classList.add("active")
    }

    questionElement.innerHTML = `
      <h2>${questionData.question}</h2>
      <div class="options-container">
        ${questionData.options
          .map((option, i) => `<button class="option-button" data-index="${i}">${option}</button>`)
          .join("")}
      </div>
    `

    questionsWrapper.appendChild(questionElement)
  })

  // Add event listeners to all option buttons
  addOptionEventListeners()

  // Update progress indicator
  updateProgressIndicator(0)
}

// Add event listeners to option buttons
function addOptionEventListeners() {
  document.querySelectorAll(".option-button").forEach((button) => {
    // Add click event listener
    button.addEventListener("click", handleOptionClick)

    // Add hover sound
    button.addEventListener("mouseenter", () => {
      sounds.hover.play()
    })
  })
}

// Update progress indicator
function updateProgressIndicator(index) {
  progressFill.style.width = `${((index + 1) / quizData.length) * 100}%`
  if (currentQuestionEl) {
    currentQuestionEl.textContent = (index + 1).toString()
  }
}

// Mostrar pergunta atual
function showQuestion(index) {
  if (isTransitioning) return

  console.log(`Showing question ${index}`)

  // Hide all questions
  document.querySelectorAll(".question").forEach((q) => {
    q.classList.remove("active")
  })

  // Show current question
  const questionElement = document.querySelector(`.question[data-index="${index}"]`)
  if (!questionElement) {
    console.error(`Question element with index ${index} not found`)
    return
  }

  questionElement.classList.add("active")

  // Update progress indicator
  updateProgressIndicator(index)

  // Animate question entrance
  anime({
    targets: questionElement,
    opacity: [0, 1],
    translateX: [50, 0],
    duration: 800,
    easing: "easeOutQuad",
  })

  // Mark previously selected option if any
  if (userAnswers[index] !== undefined) {
    const selectedOption = questionElement.querySelector(`.option-button[data-index="${userAnswers[index]}"]`)
    if (selectedOption) {
      selectedOption.classList.add("selected")
    }
  }
}

// Lidar com clique na opção
function handleOptionClick(e) {
  if (isTransitioning) return
  isTransitioning = true

  sounds.option.play()

  const selectedIndex = Number.parseInt(e.target.dataset.index, 10)
  const questionElement = e.target.closest(".question")
  const questionIndex = Number.parseInt(questionElement.dataset.index, 10)

  console.log(`Selected option ${selectedIndex} for question ${questionIndex}`)

  // Store answer
  userAnswers[questionIndex] = selectedIndex

  // Mark selected option
  questionElement.querySelectorAll(".option-button").forEach((btn) => {
    btn.classList.remove("selected")
  })
  e.target.classList.add("selected")

  // Animate selected option
  anime({
    targets: e.target,
    scale: [1, 1.05, 1],
    backgroundColor: ["rgba(0, 0, 0, 0.3)", "rgba(0, 255, 255, 0.2)", "rgba(0, 0, 0, 0.3)"],
    boxShadow: [
      "0 5px 15px rgba(0, 255, 255, 0.1)",
      "0 5px 25px rgba(0, 255, 255, 0.4)",
      "0 5px 15px rgba(0, 255, 255, 0.1)",
    ],
    duration: 600,
    easing: "easeOutQuad",
    complete: () => {
      // Go to next question or show result
      setTimeout(() => {
        if (questionIndex < quizData.length - 1) {
          // Play transition sound
          sounds.transition.play()

          // Transition to next question
          anime({
            targets: questionElement,
            opacity: 0,
            translateX: -50,
            duration: 500,
            easing: "easeOutQuad",
            complete: () => {
              currentQuestion = questionIndex + 1
              console.log(`Moving to question ${currentQuestion}`)
              showQuestion(currentQuestion)
              isTransitioning = false
            },
          })
        } else {
          // Show result
          showResult()
        }
      }, 300)
    },
  })
}

// Mostrar resultado
function showResult() {
  sounds.result.play()

  // Calculate result
  const resultIndex = calculateResult()
  const result = results[resultIndex]

  // Set result content
  powerResult.textContent = result.power
  powerDescription.textContent = result.description

  // Transition to result screen
  anime
    .timeline({
      easing: "easeOutQuad",
    })
    .add({
      targets: quizScreen,
      opacity: 0,
      translateY: -30,
      duration: 800,
      complete: () => {
        quizScreen.classList.add("hidden")
        resultScreen.classList.remove("hidden")

        // Create result particles
        createResultParticles()
      },
    })
    .add({
      targets: ".result-container",
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1000,
      easing: "easeOutExpo",
    })
    .add({
      targets: [shareButton, restartButton],
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(200),
      duration: 800,
      offset: "-=600",
      complete: () => {
        isTransitioning = false

        // Remove any existing event listeners to prevent duplicates
        shareButton.removeEventListener("click", shareResult)
        restartButton.removeEventListener("click", restartSimulation)

        // Add event listeners
        shareButton.addEventListener("click", shareResult)
        restartButton.addEventListener("click", restartSimulation)

        // Animate share button
        anime({
          targets: shareButton,
          boxShadow: [
            "0 0 15px rgba(0, 255, 255, 0.7)",
            "0 0 25px rgba(0, 255, 255, 0.9)",
            "0 0 15px rgba(0, 255, 255, 0.7)",
          ],
          scale: [1, 1.05, 1],
          duration: 2000,
          loop: true,
          easing: "easeInOutQuad",
        })
      },
    })
}

// Criar partículas de resultado
function createResultParticles() {
  const particlesContainer = document.querySelector(".result-particles")
  particlesContainer.innerHTML = ""

  // Criar 80 partículas
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement("div")
    particle.classList.add("particle")

    // Tamanho aleatório
    const size = Math.random() * 8 + 2
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    // Cor aleatória
    const color = Math.random() > 0.5 ? "var(--cyan)" : "var(--purple)"
    particle.style.background = color
    particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${color}`

    // Posição aleatória
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`

    particlesContainer.appendChild(particle)

    // Animar partícula
    anime({
      targets: particle,
      translateX: () => anime.random(-150, 150),
      translateY: () => anime.random(-150, 150),
      scale: () => [0.1, anime.random(0.5, 1.5)],
      opacity: () => [anime.random(0.2, 0.8), 0],
      duration: () => anime.random(3000, 8000),
      delay: () => anime.random(0, 2000),
      easing: "easeOutExpo",
      loop: true,
    })
  }

  // Criar efeito de fundo pulsante
  anime({
    targets: resultScreen,
    background: [
      "linear-gradient(135deg, rgba(10, 10, 42, 1), rgba(26, 10, 42, 1))",
      "linear-gradient(135deg, rgba(15, 15, 60, 1), rgba(40, 15, 60, 1))",
      "linear-gradient(135deg, rgba(10, 10, 42, 1), rgba(26, 10, 42, 1))",
    ],
    duration: 5000,
    easing: "easeInOutSine",
    loop: true,
  })
}

// Calcular resultado baseado nas respostas
function calculateResult() {
  // Algoritmo simples para determinar o resultado
  const sum = userAnswers.reduce((acc, val) => acc + val, 0)
  return sum % results.length
}

// Compartilhar resultado
function shareResult() {
  sounds.click.play()

  const resultIndex = calculateResult()
  const result = results[resultIndex]

  // Try to use Web Share API if available
  if (navigator.share) {
    navigator
      .share({
        title: "Meu Superpoder no Projeto Gênesis",
        text: `Meu superpoder no Projeto Gênesis é: ${result.power}!`,
        url: window.location.href,
      })
      .catch(() => {
        // Fallback to alert if sharing fails
        alert(`Compartilhar: Meu superpoder no Projeto Gênesis é: ${result.power}!`)
      })
  } else {
    // Fallback for browsers that don't support Web Share API
    alert(`Compartilhar: Meu superpoder no Projeto Gênesis é: ${result.power}!`)
  }
}

// Reiniciar simulação
function restartSimulation() {
  if (isTransitioning) return
  isTransitioning = true

  sounds.click.play()

  // Transição de volta para tela inicial
  anime({
    targets: resultScreen,
    opacity: 0,
    translateY: -30,
    duration: 800,
    easing: "easeOutQuad",
    complete: () => {
      resultScreen.classList.add("hidden")
      startScreen.classList.remove("hidden")

      anime({
        targets: startScreen,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: "easeOutQuad",
        complete: () => {
          isTransitioning = false
        },
      })
    },
  })
}

// Initialize the application
preloadAssets()
