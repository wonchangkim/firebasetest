//시간
moment.locale('ko');
const nowtime = moment().format('LLL');

//add버튼을 눌렀을때 새로운 엘리먼트에 넣어주고 보여주기
const addButtonEl = document.querySelector('#add-button')
const formEl = document.querySelector('#todo-form');
const inputEl = document.querySelector('#todo-input');
const listEl = document.querySelector('#todo-list');
const todowrap = document.querySelector('#todo-wrap');

//로그인 
var provider = new firebase.auth.GoogleAuthProvider();
document.querySelector('.loginbtn').addEventListener('click', async e => {
  const result = await firebase.auth().signInWithPopup(provider)
  // This gives you a Google Access Token. You can use it to access the Google API.
  //popup 뜨고 로그인 완료되면 
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
  console.log('로그인 성공');
  console.log(user);
  document.querySelector('.loginwrap').classList.add('none');

})
//인풋엔터
document.querySelector('#todo-input').addEventListener('keypress', async e => {

  if (e.key === 'Enter' && e.currentTarget.value !== '') {

    listEl.classList.add('todo-list--loading');
    const uid = firebase.auth().currentUser.uid;
    //uid를 가져오고 할일 추가 .push() 반환값은 promise await 안쓰면 밑으로 바로 넘어간다(refreshTodos가 바로 실행)
    await firebase.database().ref(`/users/${uid}/todos`).push({
      title: e.currentTarget.value,
      complete: false
    })
    // ref() 위치를 가르키는 참조
    refreshTodos();
    // push가 잘됬는지 확인하고 코드 실행된다.
  }
})

//테이터베이스값알아내기
//화면을 다시그리는 기능은 refreshTodos가 하도록 다시 짤것.
async function refreshTodos() {

  //uid 알아내기
  const uid = firebase.auth().currentUser.uid;
  const snapshot = await firebase.database().ref(`/users/${uid}/todos`).once('value');
  //호출결과는 promise
  const todos = snapshot.val(); // todos에 todos의 객체가 저장된다.
  console.log(todos);

  for (let [todoId, todo] of Object.entries(todos)) {
    //Object.entries 배열이 만들어진다.
    console.log(todo);
    add(todo.title, todo.complete, todoId)
  }
  listEl.classList.remove('todo-list--loading')
}

//로인인상태에 따라
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    document.querySelector('.loginwrap').classList.add('none');
    refreshTodos();

    // ...
  } else {
    // User is signed out.
    // ...
  }
});


function add(title, complete, id) {

  const wrapEl = document.createElement('div');
  const itemEl = document.createElement('div');
  let closebox = document.createElement('div');
  let checkbox = document.createElement('div');


  listEl.appendChild(wrapEl);
  wrapEl.classList.add('wrap');
  itemEl.textContent = title;
  wrapEl.appendChild(itemEl);
  itemEl.classList.add('txt')
  formEl.reset(); //form reset 화면리플레시

  if (complete === true) {
    console.log(complete)
    wrapEl.classList.add('complete');
    itemEl.classList.add('textdeco');
  }


  wrapEl.addEventListener('click', async e => {
    const uid = firebase.auth().currentUser.uid;

    if (!wrapEl.classList.contains('complete')) {
      await firebase.database().ref(`/users/${uid}/todos/${id}`).update({
        complete: true
      });
      wrapEl.classList.add('complete');
      itemEl.classList.add('textdeco');

    } else {
      await firebase.database().ref(`/users/${uid}/todos/${id}`).update({
        complete: false
      });
      wrapEl.classList.remove('complete');
      itemEl.classList.remove('textdeco');

    }

  });

  const close = document.createElement('div');
  close.classList.add('close');
  wrapEl.appendChild(close);

  close.textContent = String.fromCodePoint(0xD800, 0xDD02);

  close.addEventListener('click', async e => {

    const uid = firebase.auth().currentUser.uid;
    await firebase.database().ref(`/users/${uid}/todos/${id}`).remove();
   
    listEl.removeChild(wrapEl);
    e.stopPropagation();
  });

  //scroll 마지막 div로 이동
  listEl.lastChild.scrollIntoView();
}