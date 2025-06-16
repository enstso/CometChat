// Import the registration form component
import FormRegister from "../components/authentication/FormRegister";

// Define the Register page component
const Register = () => {
  return (
    // Container filling the screen height, centering the registration form, with gray background and padding
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Render the registration form */}
      <FormRegister />
    </div>
  );
};

export default Register;
