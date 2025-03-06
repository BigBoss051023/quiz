document.addEventListener('DOMContentLoaded', (event) => {
    const questions = window.questions;
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    let currentQuestionIndex = 0;

    const questionContainer = document.getElementById('question-container');
    const answersContainer = document.getElementById('answers-container');
    const nextButton = document.getElementById('next-btn');
    const backButton = document.getElementById('back-btn');

    if (questionContainer && answersContainer && nextButton && backButton) {
        showQuestion(questions[currentQuestionIndex]);

        nextButton.addEventListener('click', () => {
            saveAnswer();
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion(questions[currentQuestionIndex]);
            } else {
                localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
                window.location.href = 'results.html';
            }
        });

        backButton.addEventListener('click', () => {
            saveAnswer();
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion(questions[currentQuestionIndex]);
            }
        });
    }

    function showQuestion(question) {
        questionContainer.innerHTML = `<p>${question.question}</p>`;
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const isChecked = userAnswers[currentQuestionIndex] === answer ? 'checked' : '';
            answersContainer.innerHTML += `
                <div>
                    <input type="radio" id="answer${index}" name="answer" value="${answer}" ${isChecked}>
                    <label for="answer${index}">${answer}</label>
                </div>
            `;
        });
    }

    function saveAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            userAnswers[currentQuestionIndex] = selectedAnswer.value;
        }
    }
});