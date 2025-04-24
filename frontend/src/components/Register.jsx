import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

// Yup validation schema
const validationSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log('Form data:', values);
    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/register', values);
      toast.success(data.message); // Success notification
      navigate('/');
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || 'Error registering user'); // Error notification
      } else {
        toast.error('Error registering user');
      }
    }
  };

  const fieldIcons = {
    fullName: <FaUser className="text-purple-300 mr-3" />,
    username: <FaUserAlt className="text-purple-300 mr-3" />,
    email: <FaEnvelope className="text-purple-300 mr-3" />,
    password: <FaLock className="text-purple-300 mr-3" />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 px-4">
      <motion.div
        className="backdrop-blur-lg bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6 transform hover:scale-105 transition duration-500"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">
          Create Account
        </h2>
        <p className="text-center text-sm text-purple-200">Join us and get started!</p>

        <Formik
          initialValues={{
            fullName: '',
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6">
              {['fullName', 'username', 'email', 'password'].map((field, idx) => (
                <div key={idx}>
                  <label htmlFor={field} className="block text-sm font-medium text-purple-200 mb-1">
                    {field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="flex items-center bg-white/20 border border-white/30 rounded-xl p-3">
                    {fieldIcons[field]}
                    <Field
                      type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                      name={field}
                      placeholder={field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                      className="bg-transparent w-full text-white placeholder-purple-300 focus:outline-none"
                    />
                  </div>
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 shadow-md"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-purple-200">
          Already have an account?{' '}
          <a href="/" className="text-purple-400 hover:text-purple-500 underline">
            Login here
          </a>
        </p>
      </motion.div>

      {/* Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
};

export default Register;
