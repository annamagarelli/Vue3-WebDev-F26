const myImage = document.querySelector('img');

myImage.addEventListener('click', () => {
  const mySrc = myImage.getAttribute('src');
  if (mySrc === 'images/Tomato.png') {
    myImage.setAttribute('src', 'images/Cherry_tomatoes.jpg');
  } else {
    myImage.setAttribute('src', 'images/Tomato.png');
  }
});
