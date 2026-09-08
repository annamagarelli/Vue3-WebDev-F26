const myImage = document.querySelector('img');

myImage.addEventListener('click', () => {
  const mySrc = myImage.getAttribute('src');
  if (mySrc === 'images/Tomato.png') {
    myImage.setAttribute('src', 'images/Tomato2.png');
  } else {
    myImage.setAttribute('src', 'images/Tomato.png');
  }
});
let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

if (!localStorage.getItem('name')) {
  setUserName();
} else {
  const storedName = localStorage.getItem('name');
  myHeading.textContent = `Tomatoes are totally terrific, ${storedName}`;
}
function setUserName() {
  const myName = prompt('Please enter your name.');
  if (!myName) {
    setUserName();
  } else {
    localStorage.setItem('name', myName);
    myHeading.textContent = `Tomatoes are totally terrific, ${myName}`;
  }
}
myButton.addEventListener('click', () => {
  setUserName();
});
