let olho=document.querySelector('span');
let input = document.getElementById('senha');

olho.onclick=function revelar(){ 
    if(input.getAttribute('type') == 'password') {
    input.setAttribute('type', 'text');
} else {
    input.setAttribute('type', 'password');
}};

