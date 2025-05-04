const validator = new JustValidate('#formLogin');

validator
  .addField('#correo', [
    {
      rule: 'required',
      errorMessage: 'El correo es obligatorio',
    },
    {
      rule: 'email',
      errorMessage: 'Ingresa un correo válido',
    },
  ])
  .addField('#contrasena', [
    {
      rule: 'required',
      errorMessage: 'La contraseña es obligatoria',
    },
    {
      rule: 'password',
      errorMessage: 'Debe contener al menos una mayúscula, una minúscula, un número',
    },
    {
      rule: 'minLength',
      value: 8,
      errorMessage: 'Debe tener al menos 8 caracteres',
    },
  ])
  .onSuccess((event) => {
    event.target.submit(); // <- aquí habilitas el envío real
  });
