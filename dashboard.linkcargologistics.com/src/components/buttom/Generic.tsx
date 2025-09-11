interface ButtonProps {
    type?: 'button' | 'submit' | 'reset'; // Make 'type' optional
    label: string; // Enforce required label
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined; // Optional onClick function
  }
  
  const Button: React.FC<ButtonProps> = ({ type = 'button', label, onClick }) => {
    return (
        <button className="flex items-center px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" type={type} onClick={onClick}>
            {label}
        </button>
    );
  };
  
  export default Button;
  