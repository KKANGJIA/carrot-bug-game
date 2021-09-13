"use strict"

const $startBtn = document.querySelector(".start-button");
let $timerBtn = document.querySelector(".timer-button");
let $scoreBtn = document.querySelector(".score-button");
const $field = document.querySelector(".game-field");
const $message = document.querySelector(".message");
const $result = document.querySelector(".result");
const $retry = document.querySelector("#retry");

let score = 10;
let time = 10; //타이머 시간
let interval;
const CARROT = Array(10).fill(0).map((v,i)=>i); 
const BUG = Array(10).fill(0).map((v,i)=>i);
const widthShuffle = []; // 너비 랜덤배열
const heightShuffle = []; // 높이 랜덤배열

const bg = new Audio('./sound/bg.mp3');
const bug_pull = new Audio('./sound/bug_pull.mp3');
const carrot_pull = new Audio('./sound/carrot_pull.mp3');
const game_win = new Audio('./sound/game_win.mp3');
const alert = new Audio('./sound/alert.wav');

function startGame(){
  $timerBtn.textContent = `0:${time}`; //시간 설정
  $scoreBtn.textContent = `${score}`; //점수 설정

  $startBtn.addEventListener("click", (e) => { //시작 시, 버튼 변경
    bg.play(); //배경음악 on
    e.target.innerHTML = null;
    e.target.innerHTML = '<i class="fas fa-play"></i>'; 
    
    setTimer(); //타이머 설정
    createItems(); // 아이템 만들기
    changeScore(); //점수 변경 
    retryGame(); //게임 초기화
  })
}
startGame();

function setTimer(){
  interval = setInterval(() => {
    time--;
    if (time == 0){ //시간 끝나면
      bg.pause(); //노래 중지
      // audioFile.currentTime = 0;
      clearInterval(interval); //타이머 취소
      $message.style.display = "block"; //메세지 보이기
      $result.textContent = "YOU LOST🎉"; //메세지 보이기
      alert.play();
    }
    $timerBtn.textContent = `0:${time}`;
  }, 1000)
}

function createItems(){
  setRandom();

  let carrot;
  let bug;

  //480~1250
  CARROT.forEach((v,i) => {
    carrot = document.createElement("img");
    carrot.classList.add('carrot');
    carrot.setAttribute('src', './img/carrot.png');
    carrot.style.position = 'absolute';
    carrot.style.left = `${ widthShuffle[i] }px`;
    carrot.style.top = `${ heightShuffle[i] }px`;
    $field.appendChild(carrot);
  })
  
  BUG.forEach((v,i) => {
    bug = document.createElement("img");
    bug.classList.add('bug');
    bug.setAttribute('src', './img/bug.png');
    bug.style.position = 'absolute';
    bug.style.left = `${ widthShuffle[i] * 0.8 }px`;
    bug.style.top = `${ heightShuffle[i]+ 15 }px`;
    $field.appendChild(bug);
  }) 
}

const fieldRectWidth = Math.floor($field.getBoundingClientRect().width);
const fieldRectHeight = Math.floor($field.getBoundingClientRect().height);

//피셔 예이츠 셔플
function setRandom(){
  const widthArr = Array(fieldRectWidth-100).fill(0).map((v,i) => i); // [0 ~ 50]
  const heightArr = Array(fieldRectHeight-100).fill(0).map((v,i) => i); // [0 ~ 50]
 
  CARROT.map((v,i) => {
    const random = widthArr.splice(Math.floor(Math.random() * fieldRectWidth-80), 1)[0];
    widthShuffle.push(random);
  })
  BUG.map((v,i) => {
    const random = heightArr.splice(Math.floor(Math.random() * fieldRectHeight-80), 1)[0];
    heightShuffle.push(random);
  })
  console.log(widthShuffle, heightShuffle)
}

function changeScore(){
  const $carrots = document.querySelectorAll(".carrot");
  const $bugs = document.querySelectorAll(".bug");

  $carrots.forEach(carrot => {
    carrot.addEventListener("click", () => {
      carrot_pull.play();
      carrot.remove();
      score--;
      $scoreBtn.textContent = `${score}`;
      if(score === 0){
        $message.style.display = "block"; //메세지 보이기
        $result.textContent = "YOU WON🎉"; //메세지 보이기
        clearInterval(interval); // 타이머 중단
        game_win.play();
        bg.pause();
      }
    })
  })
  $bugs.forEach(bug => {
    bug.addEventListener("click", () => {
      bug_pull.play();
      bg.pause();
      bug.remove();
      $message.style.display = "block"; //메세지 보이기
      $result.textContent = "YOU LOST🎉"; //메세지 보이기
      clearInterval(interval); // 타이머 중단
      $startBtn.innerHTML =  '<i class="fas fa-stop"></i>'; //버튼 변경
    })
  })
}

//게임 초기화
function retryGame(){
  const $carrots = document.querySelectorAll(".carrot");
  const $bugs = document.querySelectorAll(".bug");
  $retry.addEventListener('click', () => {
    $message.style.display = 'none';
    $startBtn.innerHTML = '<i class="fas fa-stop"></i>'; 

    time = 10; 
    score = 10;
    $timerBtn.textContent = `0:${time}`;
    $scoreBtn.textContent = `${score}`;

    $carrots.forEach(carrot => { //게임 캐릭터 삭제
      carrot.remove();
    })
    $bugs.forEach(bug => {
      bug.remove();
    })
  })
}

// 3:00 기본개발 완료
// 사운드 넣기
// 코드 리팩토링