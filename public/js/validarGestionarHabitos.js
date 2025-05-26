document.addEventListener('DOMContentLoaded', function () {
  const validator = new JustValidate('#form-habito');

  const nameField = document.querySelector('#name');
  if (nameField && nameField.offsetParent !== null) {
    validator.addField('#name', [
      {
        rule: 'required',
        errorMessage: 'El nombre es obligatorio',
      },
    ]);
  }
  const iconInput = document.querySelector('#iconInput');
if (iconInput && iconInput.offsetParent !== null) {
  validator.addField('#iconInput', [
    {
      rule: 'required',
      errorMessage: 'Selecciona un icono',
    },
  ]);
}
  validator
    .addField('#description', [
      {
        rule: 'required',
        errorMessage: 'La descripción es obligatoria',
      },
    ])
    .addField('#goal', [
      {
        rule: 'required',
        errorMessage: 'La meta es obligatoria',
      },
      {
        rule: 'number',
        errorMessage: 'Debe ser un número válido',
      },
      {
        rule: 'minNumber',
        value: 1,
        errorMessage: 'Debe ser mayor o igual a 1',
      },
    ])
    .addField('#startDate', [
      {
        rule: 'required',
        errorMessage: 'La fecha de inicio es obligatoria',
      },
    ])
    .addField('#reminder', [
      {
        rule: 'required',
        errorMessage: 'Selecciona una opción',
      },
    ])
    .addField('select[name="fieldValues[unit]"]', [
      {
        rule: 'required',
        errorMessage: 'Selecciona una unidad de medida',
      },
    ])
    .addField('[name="frequency[days][]"]', [
      {
        validator: () => {
          const checkboxes = document.querySelectorAll('[name="frequency[days][]"]');
          return Array.from(checkboxes).some(cb => cb.checked);
        },
        errorMessage: 'Selecciona al menos un día de la semana',
      },
    ]),
    

  validator.onSuccess(async function (event) {
    event.target.submit();
  });
});
