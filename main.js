// called Elements
let overLay = document.querySelector(".overlay");
let start = document.querySelector(".overlay .start");
let questCountElement = document.querySelector(".count span");
let category = document.querySelector(".category span");
let quizSelector = document.querySelector(".overlay select");
let bulletsCont = document.querySelector(".bullets");
let spansCont = document.querySelector(".spans");
let questArea = document.querySelector(".quest-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit");
let result = document.querySelector(".result");
let timer = document.querySelector(".timer");

// Variables
let current = 0;
let allRightAnswers = 0;
let countdownInterval;

// functions
start.onclick = () => {
    overLay.remove();
    getQuiz(`${quizSelector.value}.json`);
}

function getQuiz(url) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            let jsQuiz = JSON.parse(request.responseText);
            // randomize + set + get length 
            randomize(jsQuiz);
            jsQuiz.length = 15;
            let questCount = jsQuiz.length;
            // set quest count + category 
            questCountElement.innerHTML = questCount;
            category.innerHTML = quizSelector.value;
            // create the bullets
            createBullets(questCount);
            // get question data
            getQuestData(jsQuiz[current], questCount, current);
            // coubt down first time
            countDown(30, questCount)
            // submit button function
            submitButton.onclick = () => {
                let rightAnswer = jsQuiz[current]["right_answer"];
                checkAnswer(rightAnswer, questCount);
                //increase current
                current++;
                //stop and re count
                clearInterval(countdownInterval)
                countDown(30, questCount)
                // clear previous quest
                questArea.innerHTML = "";
                answersArea.innerHTML = "";
                // get next quest
                getQuestData(jsQuiz[current], questCount, current);
                // activte bullet
                handleBullets();
                // show result
                showResult(questCount);
            }
        }
    }
    request.open("Get", url);
    request.send();
}

function randomize(array) {
    let current = array.length, temp, random;
    while (current > 0) {
        random = Math.floor(Math.random() * array.length);
        current--;
        //
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
}

function createBullets(count) {
    for (let i = 0; i < count; i++) {
        let span = document.createElement("span");
        spansCont.appendChild(span);
        i === 0 ? span.className = "active" : false;
    }
}

function handleBullets() {
    let bullets = Array.from(document.querySelectorAll(".spans span"));
    bullets.forEach((bullet, index) => {
        index === current ? bullet.className = "active" : false;
    });
}

function getQuestData(obj, count, index) {
    if (current < count) {
        //set quest title
        let questTitle = document.createElement("h2");
        let questTitleText = document.createTextNode(`(${index + 1})  ${obj['quest']}`);
        questTitle.appendChild(questTitleText);
        questArea.appendChild(questTitle);
        // set answers
        let arrayAnswers = [];
        for (let i = 1; i <= 4; i++) {
            let answerDiv = document.createElement("div");
            answerDiv.className = "answer";
            //
            let inputRadio = document.createElement("input");
            inputRadio.type = `radio`;
            inputRadio.name = `question`;
            inputRadio.id = `answer_${i}`;
            inputRadio.dataset.answer = obj[`answer_${i}`];
            //
            let answerLabel = document.createElement("label");
            answerLabel.htmlFor = `answer_${i}`;
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            answerLabel.appendChild(labelText);
            //
            answerDiv.appendChild(inputRadio);
            answerDiv.appendChild(answerLabel);
            //
            arrayAnswers.push(answerDiv);
        }
        //
        randomize(arrayAnswers);
        for (let i = 0; i < arrayAnswers.length; i++) {
            answersArea.appendChild(arrayAnswers[i]);
        }
        //
        let answers = document.getElementsByName("question");
        answers.forEach((answer, index) => {
            index === 0 ? answer.checked = true : false;
        });
    }
}

function checkAnswer(rightAnswer, count) {
    if (current < count) {
        let answers = document.getElementsByName("question");
        let choosenAnswer;
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].checked) {
                choosenAnswer = answers[i].dataset.answer;
            }
        }

        if (choosenAnswer === rightAnswer) {
            allRightAnswers++;
        }
    }
}

function showResult(count) {
    if (current === count) {
        questArea.remove();
        answersArea.remove();
        submitButton.remove();
        bulletsCont.remove();
        //
        if (allRightAnswers > (count / 2) && allRightAnswers < count) {
            result.innerHTML = `<p><span class="good">good</span> , ${allRightAnswers} from ${count} is true</p>`;
        } else if (allRightAnswers === count) {
            result.innerHTML = `<p><span class="perfect">Perfect</span> , all is true</p>`;
        } else {
            result.innerHTML = `<p><span class="bad">bad</span> , ${allRightAnswers} from ${count} is true</p>`;
        }
        //
        result.innerHTML += `<button class="retest">Retest</button>`;
        let retest = document.querySelector(".retest");
        retest.onclick = () => window.location.reload();
    }
}

function countDown(duration, count) {
    if (current < count) {
        let minutes, seconds;
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes < 10 ? minutes = `0${minutes}` : minutes;
            seconds < 10 ? seconds = `0${seconds}` : seconds;
            timer.innerHTML = ` ${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}