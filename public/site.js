const addbtn = document.querySelectorAll('.addcart');
const cartbtn=document.querySelector('.cartbtn')
console.log(addbtn);
console.log('hello');
let counter = 0;
addbtn.forEach(function (btn) {
  btn.addEventListener('click', function () {
    if (this.innerHTML == 'ADD+') {
      this.innerHTML = 'ADDED';
      counter ++;
      
    }
    if(counter===1);
    cartbtn.style.display='inline-block'
  });
});


//modal overlay

const modalBtn = document.querySelector('.modal-btn');
const modal = document.querySelector('.modal-overlay');
const closeBtn = document.querySelector('.close-btn');
console.log(modalBtn);
console.log(modal);
console.log(closeBtn);
modalBtn.addEventListener('click', function () {
  modal.classList.add('open-modal');
  console.log('click');
});
closeBtn.addEventListener('click', function () {
  modal.classList.remove('open-modal');
});
