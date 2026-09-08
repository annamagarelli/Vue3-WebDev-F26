const myImage = document.querySelector('img');

myImage.addEventListener('click', () => {
  const mySrc = myImage.getAttribute('src');
  if (mySrc === 'images/Tomato.png') {
    myImage.setAttribute('src', 'images/Tomato2.png');
  } else {
    myImage.setAttribute('src', 'images/Tomato.png');
  }
});
