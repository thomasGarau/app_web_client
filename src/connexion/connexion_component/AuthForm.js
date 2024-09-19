const AuthForm = ({ inputs, values, setValues }) => (
    <div className='sub-container'>
      {inputs.map((input, index) => (
        <input
          key={index}
          aria-describedby={input.errorId}
          className='input-connexion'
          type={input.type}
          id={input.id}
          name={input.name}
          placeholder={input.placeholder}
          value={values[input.name]}
          onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
          required={input.required || false}
        />
      ))}
    </div>
  );
  
  export default AuthForm;
  