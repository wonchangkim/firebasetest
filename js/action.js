
//시간
moment.locale('ko');
const nowtime = moment().format('LLL');


//add버튼을 눌렀을때 새로운 엘리먼트에 넣어주고 보여주기
const addButtonEl = document.querySelector('#add-button')
const formEl = document.querySelector('#todo-form');
const inputEl = document.querySelector('#todo-input');
const listEl = document.querySelector('#todo-list');



function add() {
  const wrapEl = document.createElement('div');
  const itemEl = document.createElement('div');
  let closebox = document.createElement('div');
  let checkbox = document.createElement('div');

  //빈값체크
  if (inputEl.value == "") {
    alert("할일을 입력하세요");

  } else {
    listEl.appendChild(wrapEl);
    wrapEl.classList.add('wrap');
    itemEl.textContent = inputEl.value;
    wrapEl.appendChild(itemEl);
    itemEl.classList.add('txt')
    formEl.reset(); //form reset
  }

  wrapEl.addEventListener('click', e => {
    if (wrapEl.classList.contains('complete')) {
      wrapEl.classList.remove('complete');
      itemEl.classList.remove('textdeco');
    } else {
      wrapEl.classList.add('complete');
      itemEl.classList.add('textdeco');
    }
  });

  let startingX;

  wrapEl.addEventListener('touchstart', e => {
    startingX = e.touches[0].clientX;
  });

  wrapEl.addEventListener('touchmove', e => {
    let touch = e.touches[0];
    let change = startingX - touch.clientX;
    let changeRight = touch.clientX - startingX;

    if (change > 0) {
      wrapEl.style.left = '-' + change + 'px';
      console.log('왼쪽');
      wrapEl.appendChild(closebox);
      closebox.textContent = '삭제하기';
      closebox.classList.add('closebox');
      closebox.style.display = 'block';
      closebox.style.right -= change + 'px';

    }
    if (changeRight > 0) {
      wrapEl.style.left = '+' + changeRight + 'px';
      console.log('오른쪽');
      wrapEl.appendChild(checkbox);
      checkbox.textContent = '완료';
      checkbox.classList.add('checkbox');
      checkbox.style.display = 'block';
      checkbox.style.right -= change + 'px';


    }

    // p2.style.display = 'block';
    // p2.style.left = (screen.width - change) + 'px';
  });

  wrapEl.addEventListener('touchend', e => {
    let change = startingX - e.changedTouches[0].clientX;
    let changeRight = e.changedTouches[0].clientX - startingX;

    //터치이동범위설정및엑션
    if (-100 < change && change < 0 || 0 < change && change < 100) {
      wrapEl.style.left = 0;
      console.log("fds");
      wrapEl.removeChild(closebox);


    } else if (change > 100) {
      listEl.removeChild(wrapEl);
      console.log("삭제");
      // p2.style.left = '100%';
      // p2.style.display = 'none';
    } else if (-100 > change) {
      console.log("체크");
      wrapEl.style.left = 0;
      wrapEl.classList.add('complete');
      itemEl.classList.add('textdeco')
    }

    // p2.style.transtion = 'all .3s';
    // p2.style.left = '0';
    // p2.style.display = 'block';

  });

  const time = document.createElement('span')
  wrapEl.appendChild(time)
  time.classList.add('padding')
  time.textContent = nowtime;

  const close = document.createElement('div')
  close.classList.add('close');
  wrapEl.appendChild(close)
  close.textContent = String.fromCodePoint(0xD800, 0xDD02);

  close.addEventListener('click', e => {
    listEl.removeChild(wrapEl);
  });

  //scroll 마지막 div로 이동
  listEl.lastChild.scrollIntoView();
}
