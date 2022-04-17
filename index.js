//need to make IIFE to avoid globally declared variable
(function (){

    const url = 'https://opentdb.com/api.php?amount=1';
    const containerEl = document.querySelector(".container");
    const form = document.querySelector("#quiz_form");
    const quesEl = document.querySelector(".ques");
    const optionEl = document.querySelector(".all_options");
    const buttonEl = document.querySelector(".buttons")
    const scoreEl = document.querySelector(".scoreBoard .score-num");
    const ansEl = document.querySelector(".scoreBoard .answered-num")
    
    let question,answer;
    let options = [];
    let score = 0;
    let answeredQues = 0;
    
    window.addEventListener('DOMContentLoaded',quizApp)
    
    async function quizApp(){
        addPlaceholder()
        //need to update scoreboard again after play again 
        updateScoreBoard()
       const data = await fetchQuiz();
       question = data[0].question;
        options = [];
        answer = data[0].correct_answer;
        data[0].incorrect_answers.map(option=>options.push(option))
        // to get corect ans on any option not just 4th one we do random shuffling
        options.splice(Math.floor(Math.random()* options.length + 1),0,answer);
        //func to ad HTML text inside req ques and options
        generateTemplate(question,options)
    }
    
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        // console.log('submited');
        if(e.target.quiz.value==''){
            alert("We need an Answer");
        }
        if (e.target.quiz.value) {
            console.log(e.target.quiz.value);
            checkQuiz(e.target.quiz.value);
            e.target.querySelector('button').style.display = 'none';
            //after submiting ans need to hide submit btn and add play again and display score card btn
            generateButton()
        }else{
            return
        }
    })
    
    async function  fetchQuiz(){
        const res = await fetch(url);
        const data = await res.json();
      //console.log(data);
        return data.results
    }
    function generateTemplate(question,options){
        //when we have our data we need to remeove placeholder
        removePlaceholder();
        optionEl.innerHTML = '';
        quesEl.innerText = question
        options.map((option,index)=>{
            const item = document.createElement('div');
            item.classList.add('option');
            item.innerHTML = `
            <input type="radio" name="quiz" value="${option}" id="option${index + 1}">
            <label for="option${index + 1}">${option}</label>`
            optionEl.appendChild(item)
        })
    }
    
    function checkQuiz(selected){
        answeredQues++;
        if (selected === answer) {
            score++;
        }
        //to update score board dynamicly we need to make a function and call it here
        updateScoreBoard()
        form.quiz.forEach(input => {
            if(input.value === answer){
                input.parentElement.classList.add('correct')
            }
        });
    }
    function updateScoreBoard(){
        scoreEl.innerText = score;
        ansEl.innerText = answeredQues
    }
    
    function generateButton(){
        const finishBtn = document.createElement('button')
        finishBtn.innerText = 'Finish';
        finishBtn.setAttribute('type','button')
        finishBtn.classList.add('finish-btn');
        buttonEl.appendChild(finishBtn);
        //next button
        const nextBtn = document.createElement('button')
        nextBtn.innerText = 'Next Quiz';
        nextBtn.setAttribute('type','button')
        nextBtn.classList.add('next-btn');
        buttonEl.appendChild(nextBtn);
    
        finishBtn.addEventListener('click',finishQuiz)
        nextBtn.addEventListener('click',nextQuiz)
    }
    function finishQuiz(){
        const nextBtn = document.querySelector(".next-btn");
        const finishBtn = document.querySelector(".finish-btn");
    
        buttonEl.removeChild(nextBtn)
        buttonEl.removeChild(finishBtn);
    
        buttonEl.querySelector('button[type="submit"]').style.display= 'block'
    
        const overlay = document.createElement('div');
        overlay.classList.add('result-overlay');
        overlay.innerHTML = `
        <div class="final-result">${score}/${answeredQues}</div>
        <button>Play Again</button>`
    
        containerEl.appendChild(overlay)
        overlay.querySelector('button').addEventListener('click',()=>{
            containerEl.removeChild(overlay)
    
            score = 0;
            answeredQues = 0;
            quizApp();
        })
    }
    
    function nextQuiz(){
        const nextBtn = document.querySelector(".next-btn");
        const finishBtn = document.querySelector(".finish-btn");
    
        buttonEl.removeChild(nextBtn);
        buttonEl.removeChild(finishBtn);
        //need to call our quizApp for next question
        //need to get back our submit button
        buttonEl.querySelector('button[type="submit"]').style.display= 'block'
        quizApp();
    
    }
    function addPlaceholder(){
        const placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        containerEl.appendChild(placeholder);
    }
    function removePlaceholder(){
        const placeholder = document.querySelector(".placeholder")
        containerEl.removeChild(placeholder)
    }
})();
