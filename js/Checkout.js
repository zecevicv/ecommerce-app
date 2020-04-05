export class Checkout {
  constructor() {
    if (document.querySelector('.checkout')) {
      const orderProductsBtn = document.querySelector('#orderProductsBtn');
      orderProductsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.checkoutHandler();
      });
    }
  }

  

  checkoutHandler() {
    let isValidForm = false;
    isValidForm = this.validateCheckoutForm();
    if (isValidForm) {
      localStorage.setItem('shoppingCart', '[]');
      window.location.href = "thank-you.html";
    }
  }

  validateCheckoutForm() {
    const checkoutForm = document.querySelector('#checkoutForm');

    const firstName = checkoutForm.querySelector('#firstName');
    const lastName = checkoutForm.querySelector('#lastName');
    const email = checkoutForm.querySelector('#email');
    const phone = checkoutForm.querySelector('#phone');
    const address = checkoutForm.querySelector('#address');
    const city = checkoutForm.querySelector('#city');
    const zipCode = checkoutForm.querySelector('#zipCode');
    const country = checkoutForm.querySelector('#country');

    if (firstName.value.trim() === '' || firstName.value.trim().length < 3) {
      firstName.closest('.input-group').classList.add('invalid');
      firstName.addEventListener('input', (e) => {
        e.currentTarget.closest('.input-group').classList.remove('invalid');
      });
    }

    if (lastName.value.trim() === '' || lastName.value.trim().length < 3) {
      lastName.closest('.input-group').classList.add('invalid');
      lastName.addEventListener('input', (e) => {
        e.currentTarget.closest('.input-group').classList.remove('invalid');
      });
    }

    if (email.value.trim() === '' || !this.validateEmail(email.value.trim())) {
      email.closest('.input-group').classList.add('invalid');
      email.addEventListener('input', (e) => {
        e.currentTarget.closest('.input-group').classList.remove('invalid');
      });
    }

    if (phone.value.trim() === '' || isNaN(phone.value.trim())) {
      phone.closest('.input-group').classList.add('invalid');
      phone.addEventListener('input', (e) => {
        e.currentTarget.closest('.input-group').classList.remove('invalid');
      });
    }

    if (address.value.trim() === '' || address.value.trim().length < 3) {
      address.closest('.input-group').classList.add('invalid');
      address.addEventListener('input', (e) => {
        e.currentTarget.closest('.input-group').classList.remove('invalid');
      });
    }

    if (city.value.trim() === '' || city.value.trim().length < 2) {
      city.closest('.input-group').classList.add('invalid');
      city.addEventListener('input', (e) => {
        e.currentTarget.closest('.input-group').classList.remove('invalid');
      });
    }

    if (zipCode.value.trim() === '' || zipCode.value.trim().length < 2) {
      zipCode.closest('.input-group').classList.add('invalid');
      zipCode.addEventListener('input', (e) => {
        e.currentTarget.closest('.input-group').classList.remove('invalid');
      });
    }

    if (country.value.trim() === '' || country.value.trim().length < 2) {
      country.closest('.input-group').classList.add('invalid');
      country.addEventListener('input', (e) => {
        e.currentTarget.closest('.input-group').classList.remove('invalid');
      });
    }

    if (
      firstName.value.trim() === '' || 
      firstName.value.trim().length < 3 || 
      lastName.value.trim() === '' || 
      lastName.value.trim().length < 3 || 
      email.value.trim() === '' || 
      !this.validateEmail(email.value.trim()) || 
      phone.value.trim() === '' || 
      isNaN(phone.value.trim()) || 
      address.value.trim() === '' || 
      address.value.trim().length < 3 || 
      city.value.trim() === '' || 
      city.value.trim().length < 2 || 
      zipCode.value.trim() === '' || 
      zipCode.value.trim().length < 2 || 
      country.value.trim() === '' || 
      country.value.trim().length < 2) 
      {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }


}