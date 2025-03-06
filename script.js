document.addEventListener('DOMContentLoaded', (event) => {
    const questions = window.questions;
    let currentQuestionIndex = 0;
    let score = 0;
    const userAnswers = [];

    const usernameInput = document.getElementById('username');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionContainer = document.getElementById('question-container');
    const answersContainer = document.getElementById('answers-container');
    const nextButton = document.getElementById('next-btn');
    const backButton = document.getElementById('back-btn');
    const userGreeting = document.getElementById('user-greeting');
    const scoreDisplay = document.getElementById('score');
    const leaderboard = document.getElementById('leaderboard');
    const reviewAnswersBtn = document.getElementById('review-answers-btn');

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            if (username) {
                localStorage.setItem('username', username);
                window.location.href = 'quiz.html';
            } else {
                alert('Please enter your name.');
            }
        });
    }

    if (questionContainer && answersContainer && nextButton && backButton) {
        const username = localStorage.getItem('username');
        if (userGreeting) userGreeting.textContent = `Hi, ${username}!`;

        showQuestion(questions[currentQuestionIndex]);

        nextButton.addEventListener('click', () => {
            const selectedAnswer = document.querySelector('input[name="answer"]:checked');
            if (selectedAnswer) {
                userAnswers[currentQuestionIndex] = selectedAnswer.value;
                if (selectedAnswer.value === questions[currentQuestionIndex].correct) {
                    score++;
                }
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion(questions[currentQuestionIndex]);
                } else {
                    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
                    localStorage.setItem('score', score);
                    saveHighScore(username, score);
                    window.location.href = 'results.html';
                }
            } else {
                alert('Please select an answer.');
            }
        });

        backButton.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion(questions[currentQuestionIndex]);
                document.querySelector(`input[name="answer"][value="${userAnswers[currentQuestionIndex]}"]`).checked = true;
            }
        });
    }

    if (scoreDisplay) {
        scoreDisplay.textContent = localStorage.getItem('score');
    }

    if (leaderboard) {
        displayHighScores();
    }

    if (reviewAnswersBtn) {
        reviewAnswersBtn.addEventListener('click', () => {
            window.location.href = 'review.html';
        });
    }

    window.clearScores = () => {
        localStorage.removeItem('highScores');
        displayHighScores();
    };

    function showQuestion(question) {
        questionContainer.innerHTML = `<p>${question.question}</p>`;
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.innerHTML = `
                <input type="radio" id="answer${index}" name="answer" value="${answer}">
                <label for="answer${index}">${answer}</label>
            `;
            answersContainer.appendChild(answerElement);
        });
    }

    function saveHighScore(username, score) {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push({ username, score });
        highScores.sort((a, b) => b.score - a.score); // Sort by score in descending order
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    function displayHighScores() {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        leaderboard.innerHTML = '';
        highScores.forEach(score => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${score.username}</td><td>${score.score}</td>`;
            leaderboard.appendChild(row);
        });
    }
});