document.addEventListener('DOMContentLoaded', function () {
  const validator = new JustValidate('#form-habito');

  // Validar #name solo si existe y es visible
  const nameField = document.querySelector('#name');
  if (nameField && nameField.offsetParent !== null) {
    validator.addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Campos obligatorios incompletos',
      },
      {
        rule: 'customRegexp',
        value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,()_\-°"'/&@¡!¿?#%:;]+$/,
        errorMessage: 'Caracteres no válidos detectados',
      },
    ]);
  }

  // Validar #iconInput solo si existe y es visible
  const iconField = document.querySelector('#iconInput');
  if (iconField && iconField.offsetParent !== null) {
    validator.addField('#iconInput', [
      {
        rule: 'required',
        errorMessage: 'Campos obligatorios incompletos',
      },
    ]);
  }

  // Descripción
  validator.addField('#description', [
    {
      rule: 'required',
      errorMessage: 'Campos obligatorios incompletos',
    },
  ]);

  // Meta numérica: validar según campo visible
  const goalInput = document.getElementById('goal');
  const sliderInput = document.getElementById('sliderHidden');

  if (goalInput && goalInput.offsetParent !== null) {
    validator.addField('#goal', [
      { rule: 'required', errorMessage: 'Campos obligatorios incompletos' },
      { rule: 'number', errorMessage: 'Debe ser un número válido' },
      { rule: 'minNumber', value: 1, errorMessage: 'Debe ser mayor o igual a 1' },
    ]);
  } else if (sliderInput && sliderInput.name === 'fieldValues[value]') {
    validator.addField('#sliderHidden', [
      { rule: 'required', errorMessage: 'Campos obligatorios incompletos' },
      { rule: 'number', errorMessage: 'Debe ser un número válido' },
      { rule: 'minNumber', value: 1, errorMessage: 'Debe ser mayor o igual a 1' },
    ]);
  }

  // Unidad de medida
  validator.addField('#unitSelect', [
    {
      rule: 'required',
      errorMessage: 'Campos obligatorios incompletos',
    },
  ]);

  // Fecha de inicio
  validator.addField('#startDate', [
    {
      rule: 'required',
      errorMessage: 'Campos obligatorios incompletos',
    },
  ]);

  // Recordatorio
  validator.addField('#reminderInput', [
    {
      rule: 'required',
      errorMessage: 'Campos obligatorios incompletos',
    },
  ]);

  // Días de la semana: al menos uno
  validator.addField('[name="frequency[days][]"]', [
    {
      validator: () => {
        const checkboxes = document.querySelectorAll('[name="frequency[days][]"]');
        return Array.from(checkboxes).some(cb => cb.checked);
      },
      errorMessage: 'Campos obligatorios incompletos',
    },
  ]);
  // Revalidar fecha de inicio cuando se seleccione
  const fechaInput = document.querySelector('#startDate');
  if (fechaInput) {
      fechaInput.addEventListener('change', () => {
        validator.revalidateField('#startDate');
      });
    }

    // Revalidar días de la semana cuando se seleccione o deseleccione alguno
    const diasCheckboxes = document.querySelectorAll('[name="frequency[days][]"]');
    diasCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      validator.revalidateField('[name="frequency[days][]"]');
    });
  });
  // Evento al validar correctamente
  validator.onSuccess(function (event) {
    event.preventDefault();
    event.target.dispatchEvent(new Event('submit-form-validado', { bubbles: true }));
  });
});
