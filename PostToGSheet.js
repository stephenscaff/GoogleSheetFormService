
/**
 * Form To Google Sheet
 * Form that submits to a google sheet via fetch.
 * The sheet uses Google SHeet Api to handle our requests.
 */
var FormToSheet = function() {

  var scriptURL = 'https://script.google.com/macros/s/AKfycbxryj2dvOlo5Lt3whqsfKPqnH4IWgVweVeGjoBBTX_aXfxfTkk/exec';
  var form = document.forms['gsc-modal-form-submit'];
  var signupCheck = document.querySelector('.js-terms-check');
  var signupCheckWrap = document.querySelector('.gsc-modal-form__check');
  var loading = document.querySelector('.js-loading');
  var successMessage = document.querySelector('.js-success-message');
  var errorMessage = document.querySelector('.js-error-message');

  return {

    init: function() {
      this.bindEvents();
    },

    bindEvents: function() {

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        FormToSheet.validateForm();
      });
    },

    /**
     * Validate Form
     */
    validateForm: function() {

      var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      var emailField = form["email"];


      // Validate Email
      if (!emailField.value.match(emailFormat)) {
        emailField.classList.add('is-invalid')
      } else {
        emailField.classList.remove('is-invalid')
      }

      if (emailField.value == "") {
        emailField.classList.add('is-invalid')
        return;
      } else {
        emailField.classList.remove('is-invalid')
      }

      // Validate Terms Check
      if (signupCheck.checked === false) {
        signupCheckWrap.classList.add('is-invalid');
        return;
      }

      // Finally, make fetch request
      FormToSheet.handleRequest();

    },


    /**
     * Handle Fetch
     */
    handleRequest: function() {

      // Show Loader
      FormToSheet.showLoader();

      // Fetch Request
      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(function (response) {
        return FormToSheet.onSuccess(response);
      }).catch(function (error) {
        return FormToSheet.onError(error);
      });
    },

    /**
     * Show Loader UI
     */
    showLoader: function() {
      form.classList.add('is-hidden');
      loading.classList.remove('is-hidden');
    },

    /**
     * Handle Success State
     */
    onSuccess: function(response) {
      setTimeout(function () {
        successMessage.classList.remove('is-hidden');
        loading.classList.add('is-hidden');
      }, 500);
    },

    /**
     * Handle Error State
     */
    onError: function(error) {
      setTimeout(function () {
        errorMessage.classList.remove('is-hidden');
        loading.classList.add('is-hidden');
      }, 500);
    },
  }
}();

// Init
FormToSheet.init();
