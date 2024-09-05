document.addEventListener('DOMContentLoaded', function () {
    // Attach the event listener to the select-all checkbox
    document.getElementById('select-all').addEventListener('change', function () {
      // Select all checkboxes with the class 'form-checkbox'
      var checkboxes = document.querySelectorAll('.form-checkbox');
      // Iterate over checkboxes to set their checked property
      checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
    });
  });