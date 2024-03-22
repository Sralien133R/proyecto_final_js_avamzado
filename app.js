document.addEventListener('DOMContentLoaded', () => {
    const difficultySelect = document.getElementById('difficulty');
    const typeSelect = document.getElementById('type');
    const generateButton = document.getElementById('generate');
    const triviaContainer = document.getElementById('trivia');
    const restartButton = document.getElementById('restart');
    const scoreContainer = document.getElementById('score');

    let questions = [];
    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    generateButton.addEventListener('click', () => {
        const difficulty = difficultySelect.value;
        const type = typeSelect.value;

        fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=${type}`)
            .then(response => response.json())
            .then(data => {
                questions = data.results;
                currentQuestionIndex = 0;
                correctAnswers = 0;
                showQuestion();
                generateButton.style.display = 'none'; // Oculta el botón de generar
                restartButton.style.display = 'none'; // Oculta el botón de reiniciar
                scoreContainer.style.display = 'none'; // Oculta el contenedor de puntuación
            });
    });

    restartButton.addEventListener('click', () => {
        generateButton.style.display = 'inline-block'; // Muestra el botón de generar
        restartButton.style.display = 'none'; // Oculta el botón de reiniciar
        scoreContainer.style.display = 'none'; // Oculta el contenedor de puntuación
    });

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        const questionElement = document.createElement('div');
        questionElement.classList.add('question', 'border', 'border-gray-300', 'rounded', 'p-4', 'mb-4');
        questionElement.innerHTML = `
            <p class="mb-4">${currentQuestionIndex + 1}. ${question.question}</p>
            <div class="grid gap-4">
                ${question.incorrect_answers.map(answer => `<button class="answer-btn p-4 bg-blue-500 text-white font-bold rounded">${answer}</button>`).join('')}
                <button class="answer-btn p-4 bg-blue-500 text-white font-bold rounded">${question.correct_answer}</button>
            </div>
        `;
        triviaContainer.innerHTML = '';
        triviaContainer.appendChild(questionElement);

        // Agrega eventos de clic a las respuestas
        questionElement.querySelectorAll('.answer-btn').forEach(answerBtn => {
            answerBtn.addEventListener('click', () => {
                const correctAnswer = question.correct_answer;
                if (answerBtn.textContent === correctAnswer) {
                    answerBtn.style.backgroundColor = '#4CAF50'; // Respuesta correcta
                    correctAnswers++;
                } else {
                    answerBtn.style.backgroundColor = '#f44336'; // Respuesta incorrecta
                }

                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < 10) {
                        showQuestion();
                    } else {
                        showScore();
                    }
                }, 1000);
            });
        });
    }

    function showScore() {
        const score = correctAnswers * 100;
        scoreContainer.textContent = `Tu puntaje es: ${score}`;
        scoreContainer.style.display = 'block'; // Muestra el contenedor de puntuación
        restartButton.style.display = 'inline-block'; // Muestra el botón de reiniciar
    }
});