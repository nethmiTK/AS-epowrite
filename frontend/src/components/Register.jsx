import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AnimatedBalls from '../components/AnimatedBalls';
import logo from '../assets/epowrite.png';
import { toast, ToastContainer } from 'react-toastify'; // Importing Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

// Updated validation schema with custom email validation
const validationSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .test('contains-dot', 'Email must contain a dot (.)', (value) => value && value.includes('.')) // Custom test for dot
    .required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/register', values);
      toast.success(data.message); // Show success notification
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error registering user'); // Show error notification
    } finally {
      setSubmitting(false);
    }
  };

  const fieldIcons = {
    fullName: <FaUser className="text-darkGrey mr-3" />,
    username: <FaUserAlt className="text-darkGrey mr-3" />,
    email: <FaEnvelope className="text-darkGrey mr-3" />,
    password: <FaLock className="text-darkGrey mr-3" />,
    confirmPassword: <FaLock className="text-darkGrey mr-3" />, // Confirm Password icon
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 relative">
      <AnimatedBalls />

      <motion.div
        className="bg-white/90 border-4 border-darkGrey p-8 sm:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] w-full max-w-md z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16 w-16 sm:h-24 sm:w-24 rounded-full" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-darkGrey">Create Account</h2>
        <p className="text-center text-sm text-darkGrey">Join us and get started!</p>

        <Formik
          initialValues={{ fullName: '', username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 mt-6">
              {['fullName', 'username', 'email', 'password', 'confirmPassword'].map((field, idx) => (
                <div key={idx}>
                  <label htmlFor={field} className="block text-sm font-bold text-darkGrey mb-1">
                    {field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="flex items-center bg-white/20 border border-darkGrey/30 rounded-xl p-2">
                    {fieldIcons[field]}
                    <Field
                      type={field === 'email' ? 'email' : field === 'password' || field === 'confirmPassword' ? 'password' : 'text'}
                      name={field}
                      placeholder={field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                      className="bg-transparent w-full text-darkGrey placeholder-darkGrey focus:outline-none"
                    />
                  </div>
                  <ErrorMessage name={field} component="div" className="text-red-500 text-sm mt-1" />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-2xl font-semibold text-white shadow-md transition duration-300 ${
                  isSubmitting
                    ? 'bg-darkGrey cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500'
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>

              <p className="text-center text-sm text-darkGrey">
                Already have an account?{' '}
                <a href="/" className="text-purple-500 hover:underline">
                  Login here
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </motion.div>

      {/* ToastContainer to display the notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Register;
