// catch element

let countSpan = document.querySelector(".quiz-app .quiz-info .count span");
let bullets = document.querySelector(".bullets")
let bulletsSpanContainer = document.querySelector(".quiz-app .bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let subBtn = document.querySelector(".quiz-app .submit-button");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countDown");
let currentIndex = 0;
let score = 0;
let countDownInterval;




function getQuestions() {
    let myHttp = new XMLHttpRequest();
    myHttp.onreadystatechange = function() {
        if (this.status === 200 && this.readyState === 4) {
            let questionOpject = JSON.parse(this.responseText)
            let questionsCount = questionOpject.length;
            //create bullets
            createbullets(questionsCount);
            // push the questions
            addQuestions(questionOpject[currentIndex], questionsCount);
            // start countb down
            countDown(5, questionsCount);
            //check data
            subBtn.onclick = () => {
                let theRightAnswer = questionOpject[currentIndex].right_answer;
                //increase the current index
                currentIndex++;
                // stop interval for the previnterval
                clearInterval(countDownInterval);
                // start countb down
                countDown(5, questionsCount);
                // check the answers
                checkAnswer(theRightAnswer, questionsCount);
                // clear data 
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                // push the next questions
                addQuestions(questionOpject[currentIndex], questionsCount);
                // make the bullets blue
                handelBullets();
                console.log(score);
                showResults(questionsCount);
            }
        }
    }
    myHttp.open("GET", "html_questions.json", true);
    myHttp.send();
}
getQuestions();

function createbullets(num) {
    countSpan.innerHTML = num;
    //create bullerts
    for (let i = 0; i < num; i++) {
        let theBullete = document.createElement("span");
        if (i === 0) {
            theBullete.className = 'on';
        }
        //append bullets to the main bullete container
        bulletsSpanContainer.appendChild(theBullete);
    }
}

function addQuestions(obj, count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj[`title`]);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
        // put the answers
        for (let i = 1; i <= 4; i++) {
            let answerDiv = document.createElement("div");
            answerDiv.className = ("answer");
            let radioElement = document.createElement("input");
            radioElement.type = "radio";
            radioElement.id = `answer_${i}`;
            radioElement.name = 'question';
            radioElement.dataset.answer = obj[`answer_${i}`];

            // set labels 
            let labelRadio = document.createElement("label");
            labelRadio.htmlFor = `answer_${i}`;
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            labelRadio.appendChild(labelText);

            // append childs to the answerDiv
            answerDiv.appendChild(radioElement);
            answerDiv.appendChild(labelRadio);
            //append child for the answerArea
            answersArea.appendChild(answerDiv);
        }
    }
}

function checkAnswer(trueAnswer, Count) {
    let answers = document.getElementsByName('question');
    let theChoosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (trueAnswer === theChoosenAnswer) {
        score++;
        console.log("true answer")
    }
}

function handelBullets() {
    let bulletSpans = document.querySelectorAll(".quiz-app .bullets .spans span");
    let bulletsList = Array.from(bulletSpans);
    bulletsList.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResults(count) {
    let result;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        subBtn.remove();
        bullets.remove();

        if (score > (count / 2) && score < count) {
            result = `<span class="good">Good</span> you answered ${score} from ${count}`;
        } else if (score === count) {
            result = `<span class="perfect">perfect</span> you answered ${score} from ${count}`;
        } else {
            result = `<span class="bad">bad</span> you answered ${score} from ${count}`;
        }

    }

    resultsContainer.innerHTML = result;
    resultsContainer.style.padding = '10px';
    resultsContainer.style.backgroundColor = 'white';
    resultsContainer.style.marginTop = '10px';
}

function countDown(duration, count) {
    let minutes, seconds;
    if (currentIndex < count) {
        countDownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                subBtn.click();
            }
        }, 1000);
    }

}