const menu = document.querySelector(".menu");
const navlist = document.querySelector(".navlist");

function fnsoma() {
  menu.classList.toggle('active');
  navlist.classList.toggle('active');
}

class MobileNavbar {
  constructor(Menu, navList, navLinks) {
    this.Menu = document.querySelector(Menu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";
    
  }


  animateLinks(){
    this.navLinks.forEach((link) =>{
      link.style.animation
      ? (link.style.animation="")
      : (link.style.animation='navLinkFade 1.5s ease forwards 0.3s');
    });
  }


  handleClick() {
    console.log(this);
    this.navList.classList.toggle(this.activeClass);
    this.animateLinks();
  }

  addClickEvent() {
    this.Menu.addEventListener("click", () => this.handleClick());
  }

  init() {
    if (this.Menu) {
      this.addClickEvent();
    }
    return this;
  }
}

const mobileNavbar = new MobileNavbar(
  ".menu",
  ".navlist",
  ".navlist li"
);
mobileNavbar.init();