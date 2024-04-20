document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get('referralCode');
  if (referralCode) {
      document.getElementById('referal').value = referralCode;
  }

  const form = document.getElementById('signupForm');
  form.addEventListener('submit', function(event) {
      event.preventDefault();

      const proxyUrl = 'https://api.allorigins.win/';
      const apiUrl = 'https://geotopup.azurewebsites.net/user/signup';

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Cookie", "ARRAffinity=92ca53ad8db4fbb93d4d3b7d8ab54dcf8ffecb2d731f25b0e91ad575d7534c3f; ARRAffinitySameSite=92ca53ad8db4fbb93d4d3b7d8ab54dcf8ffecb2d731f25b0e91ad575d7534c3f");

      const formData = new FormData(form);
      formData.set('is_web', 'true');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const numberRegex = /^0\d{10}$/;
      const passwordMinLength = 6;

      let isValid = true;

      // Validate email
      const emailInput = formData.get('email');
      if (!emailRegex.test(emailInput)) {
          isValid = false;
          document.getElementById('emailError').innerText = 'Invalid email format';
      } else {
          document.getElementById('emailError').innerText = '';
      }

      // Validate number
      const numberInput = formData.get('number');
      if (!numberRegex.test(numberInput)) {
          isValid = false;
          document.getElementById('numberError').innerText = 'Invalid phone number format';
      } else {
          document.getElementById('numberError').innerText = '';
      }

      // Validate password
      const passwordInput = formData.get('password');
      if (passwordInput.length < passwordMinLength) {
          isValid = false;
          document.getElementById('passwordError').innerText = 'Password must be at least 6 characters long';
      } else {
          document.getElementById('passwordError').innerText = '';
      }

      if (isValid) {
          const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: formData,
              redirect: "follow"
          };

          fetch(proxyUrl + apiUrl, requestOptions)
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Failed to submit form');
                  }
                  return response.json();
              })
              .then(data => {
                  console.log(data);
                  // Show success message to the user
                  const successElement = document.createElement('div');
                  successElement.classList.add('success-message');
                  successElement.innerText = 'Form submitted successfully!';
                  form.parentNode.insertBefore(successElement, form.nextSibling);
                  // Clear the form after successful submission
                  form.reset();
              })
              .catch(error => {
                  const errorElement = document.createElement('div');
                  errorElement.classList.add('error-message');
                  errorElement.innerText = 'Error submitting form: ' + error.message;
                  form.insertBefore(errorElement, form.firstChild);
              });
      }
  });
});
