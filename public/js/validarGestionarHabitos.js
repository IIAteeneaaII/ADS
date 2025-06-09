document.addEventListener('DOMContentLoaded', function () {
  const validator = new JustValidate('#form-habito');

  // Validar #name solo si existe y es visible
  const nameField = document.querySelector('#name');
  if (nameField && nameField.offsetParent !== null) {
    validator.addField('#name', [
      {
        rule: 'required',
        errorMessage: 'El nombre es obligatorio',
      },
    ]);
  }

  // Validar #iconInput solo si existe y es visible
  const iconField = document.querySelector('#iconInput');
  if (iconField && iconField.offsetParent !== null) {
    validator.addField('#iconInput', [
      {
        rule: 'required',
        errorMessage: 'Selecciona un icono',
      },
    ]);
  }

  // Descripción
  validator.addField('#description', [
    {
      rule: 'required',
      errorMessage: 'La descripción es obligatoria',
    },
  ]);

  // Meta numérica: validar según campo visible
  const goalInput = document.getElementById('goal');
  const sliderInput = document.getElementById('sliderHidden');

  if (goalInput && goalInput.offsetParent !== null) {
    validator.addField('#goal', [
      { rule: 'required', errorMessage: 'La meta es obligatoria' },
      { rule: 'number', errorMessage: 'Debe ser un número válido' },
      { rule: 'minNumber', value: 1, errorMessage: 'Debe ser mayor o igual a 1' },
    ]);
  } else if (sliderInput && sliderInput.name === 'fieldValues[value]') {
    validator.addField('#sliderHidden', [
      { rule: 'required', errorMessage: 'La meta es obligatoria' },
      { rule: 'number', errorMessage: 'Debe ser un número válido' },
      { rule: 'minNumber', value: 1, errorMessage: 'Debe ser mayor o igual a 1' },
    ]);
  }

  // Unidad de medida
  validator.addField('#unitSelect', [
    {
      rule: 'required',
      errorMessage: 'Selecciona una unidad de medida',
    },
  ]);

  // Fecha de inicio
  validator.addField('#startDate', [
    {
      rule: 'required',
      errorMessage: 'La fecha de inicio es obligatoria',
    },
  ]);

  // Recordatorio
  validator.addField('#reminderInput', [
    {
      rule: 'required',
      errorMessage: 'Selecciona una opción de notificación',
    },
  ]);

  // Días de la semana: al menos uno
  validator.addField('[name="frequency[days][]"]', [
    {
      validator: () => {
        const checkboxes = document.querySelectorAll('[name="frequency[days][]"]');
        return Array.from(checkboxes).some(cb => cb.checked);
      },
      errorMessage: 'Selecciona al menos un día de la semana',
    },
  ]);

  // Evento al validar correctamente
  validator.onSuccess(function (event) {
    event.preventDefault();
    event.target.dispatchEvent(new Event('submit-form-validado', { bubbles: true }));
  });
});
