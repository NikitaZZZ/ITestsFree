// Random number
const getRandId = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();

let app = new Vue({
    el: '#app',
    data: {
        nameTest: '',
        showFormInputName: true,
        correctAnswer: 0,
        questionNumber: 0,
        questionNumberForShow: -1,
        test: [],

        answer1Test: '',
        answer2Test: '',
        answer3Test: '',
        answer4Test: '',

        answers: [
            { first: 0 },
            { second: 0 },
            { third: 0 },
            { fourth: 0 }
        ],
    },

    methods: {
        createQuestion: function 
            (name, option1, option2, 
            option3, option4)
        {
            // get elements from form (name test, options)
            const nameTestElem = document.getElementById(name).value;
            const option1Elem = document.getElementById(option1).value;
            const option2Elem = document.getElementById(option2).value;
            const option3Elem = document.getElementById(option3).value;
            const option4Elem = document.getElementById(option4).value;

            if (nameTestElem == "" || 
                option1Elem == "" || 
                option2Elem == "" || 
                option3Elem == "" || 
                option4Elem == "") 
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Ошибка!',
                    text: 'Введите текст во все поля!',
                });
            }

            // create question
            // if the user has uploaded an image, then it is uploaded to firebase storage
            if (document.getElementById("checkboxFile").checked) {} else {
                let file = document.getElementById("files").files[0];
                let storageRef = firebase.storage().ref(`/testFree${numberId}/` + `question${questionNumber}`);
                let uploadTask = storageRef.put(file);
        
                uploadTask.on('state_changed', (snapshot) => {}, (error) => {}, () => {
                    let downloadURL = uploadTask.snapshot.downloadURL;
                });
            }

            this.test.push({
                questionName: nameTestElem,
                option1: option1Elem,
                option2: option2Elem,
                option3: option3Elem,
                option4: option4Elem,
            });

            this.questionNumber += 1;
            this.questionNumberForShow += 1;

            document.getElementById('pills-tab').innerHTML += `
                <li class="nav-item ml-2">
                    <a class="nav-link mt-2" id="pills-test${this.questionNumber}-tab" data-bs-toggle="collapse" href="#pills-test${this.questionNumber}" role="tab" aria-controls="pills-plus" aria-selected="false">Вопрос ${this.questionNumber}</a>
                </li>
            `;
      
            document.getElementById('questions').innerHTML += `
                <div class="collapse" id="pills-test${this.questionNumber}">
                    <div class="card text-center">
                        <div class="card-header">
                            <h5 class="card-title" style="margin-bottom: 0; padding-bottom: 0;">${this.test[this.questionNumberForShow].questionName}</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">1) ${this.test[this.questionNumberForShow].option1}</p>
                            <p class="card-text">2) ${this.test[this.questionNumberForShow].option2}</p>
                            <p class="card-text">3) ${this.test[this.questionNumberForShow].option3}</p>
                            <p class="card-text">4) ${this.test[this.questionNumberForShow].option4}</p>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById(name).value = '';
            document.getElementById(option1).value = '';
            document.getElementById(option2).value = '';
            document.getElementById(option3).value = '';
            document.getElementById(option4).value = '';
            document.getElementById("checkboxFile").checked = false;
        },

        checkNameTest: function (elem) {
            if (document.getElementById(elem).value != '') {
                this.showFormInputName = false;
            }
        },

        createTest: function () {
            const testId = getRandId();

            let answer1TestElem = document.getElementById('resultInput1').value;
            let answer2TestElem = document.getElementById('resultInput2').value;
            let answer3TestElem = document.getElementById('resultInput3').value;
            let answer4TestElem = document.getElementById('resultInput4').value;

            let inputText1Elem = document.getElementById('inputText1').value;
            let inputText2Elem = document.getElementById('inputText2').value;
            let inputText3Elem = document.getElementById('inputText3').value;
            let inputText4Elem = document.getElementById('inputText4').value;

            let inputQuestion = document.getElementById('inputQuestion').value;

            firebase.database().ref(`testsFree/${testId}`).set({
                id: testId,
                nameTest: this.nameTest,
                questions: this.test,
                answer1Test: answer1TestElem,
                answer2Test: answer2TestElem,
                answer3Test: answer3TestElem,
                answer4Test: answer4TestElem,
            });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Вы успешно создали тест!',
                showConfirmButton: false,
                timer: 2000,
            });

            inputQuestion = "";

            inputText1Elem = "";
            inputText2Elem = "";
            inputText3Elem = "";
            inputText4Elem = "";           
            
            answer1TestElem = "";
            answer2TestElem = "";
            answer3TestElem = "";
            answer4TestElem = "";
        },
    },
});

firebase.database().ref(`testsFree/`).on('child_added', (data) => {
    answer1Test = data.val().answer1Test;
    answer2Test = data.val().answer2Test;
    answer3Test = data.val().answer3Test;
    answer4Test = data.val().answer4Test;

    id = data.val().id;
        
    nameTest = data.val().nameTest;
    questions = data.val().questions;

    document.getElementById('tests').innerHTML += `
        <div class="card mb-3" style="width: 18rem; margin-left: 1%; margin-right: 1%;">
            <div class="card-body">
                <h5 class="card-title">${nameTest}</h5>
                <button class="btn btn-outline-primary mt-3" id="passTest" data-bs-toggle="modal" data-bs-target="#testFree${id}">Пройти тест</button>
            </div>
        </div>

        <div class="modal fade" id="testFree${id}" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${nameTest}</h5>
                        <button type="button" class="btn-close" onclick="clearArray()" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="questionsDiv${id}"></div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-success" id="answerTest${id}" onclick="checkTest('${answer1Test}', '${answer2Test}', '${answer3Test}', '${answer4Test}')">
                            Закончить тест
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const questionsDiv = document.getElementById(`questionsDiv${id}`);
    for (let i = 0; i < questions.length; i++) {
        questionsDiv.innerHTML += `
            <h5 class="mt-2">${questions[i].questionName}</h5>
            <hr>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="radio${questions[i].questionName}" id="testRadio1${questions[i].questionName}">
                <label class="form-check-label" for="testRadio1${questions[i].questionName}">
                    <h6>${questions[i].option1}</h6>
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="radio${questions[i].questionName}" id="testRadio2${questions[i].questionName}">
                <label class="form-check-label" for="testRadio2${questions[i].questionName}">
                    <h6>${questions[i].option2}</h6>
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="radio${questions[i].questionName}" id="testRadio3${questions[i].questionName}">
                <label class="form-check-label" for="testRadio3${questions[i].questionName}">
                    <h6>${questions[i].option3}</h6>
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="radio${questions[i].questionName}" id="testRadio4${questions[i].questionName}">
                <label class="form-check-label" for="testRadio4${questions[i].questionName}">
                    <h6>${questions[i].option4}</h6>
                </label>
            </div>
            <button class="btn btn-outline-success" id="answerQuestion${id}" onclick="answerQuestion('${questions[i].questionName}')">
                Ответить
            </button>
        `;
    }
});

function clearArray() {
    app.answers[0].first = 0;
    app.answers[0].second = 0;
    app.answers[0].third = 0;
    app.answers[0].fourth = 0;

    console.log(app.answers);
}

function answerQuestion(questionName) {
    const radio1Elem = document.getElementById(`testRadio1${questionName}`);
    const radio2Elem = document.getElementById(`testRadio2${questionName}`);
    const radio3Elem = document.getElementById(`testRadio3${questionName}`);
    const radio4Elem = document.getElementById(`testRadio4${questionName}`);

    if (radio1Elem.checked) {
        app.answers[0].first += 1;
    } else if (radio2Elem.checked) {
        app.answers[0].second += 1;
    } else if (radio3Elem.checked) {
        app.answers[0].third += 1;
    } else if (radio4Elem.checked) {
        app.answers[0].fourth += 1;
    }

    Swal.fire({
        icon: 'success',
        title: 'Ответ принят!',
        timer: 1000,
    })
}

function checkTest(answer1Test, answer2Test, answer3Test, answer4Test) {
    if (app.answers[0].first <= 5) {
        Swal.fire({
            icon: 'info',
            title: 'Результат',
            text: answer1Test,
        });
    } 
    
    if (app.answers[0].second <= 6) {
        Swal.fire({
            icon: 'info',
            title: 'Результат',
            text: answer2Test,
        });
    } 
    
    if (app.answers[0].third <= 4) {
        Swal.fire({
            icon: 'info',
            title: 'Результат',
            text: answer3Test,
        });
    } 
    
    if (app.answers[0].fourth <= 3) {
        Swal.fire({
            icon: 'info',
            title: 'Результат',
            text: answer4Test,
        });
    }
}