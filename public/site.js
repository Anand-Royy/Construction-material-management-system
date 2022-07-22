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
