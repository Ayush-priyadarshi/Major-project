(() => {
   
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

document.addEventListener('DOMContentLoaded', function () {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeIcon = document.getElementById('darkModeIcon');
  const body = document.body;

  // Load dark mode preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    if (darkModeIcon) {
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun');
    }
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function () {
      body.classList.toggle('dark-mode');
      const enabled = body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
      if (darkModeIcon) {
        if (enabled) {
          darkModeIcon.classList.remove('fa-moon');
          darkModeIcon.classList.add('fa-sun');
        } else {
          darkModeIcon.classList.remove('fa-sun');
          darkModeIcon.classList.add('fa-moon');
        }
      }
    });
  }
});