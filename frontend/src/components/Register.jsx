import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/register', values);
      alert(data.message);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering user');
    }
  };

  const fieldIcons = {
    fullName: <FaUser className="text-darkGrey mr-3" />,
    username: <FaUserAlt className="text-darkGrey mr-3" />,
    email: <FaEnvelope className="text-darkGrey mr-3" />,
    password: <FaLock className="text-darkGrey mr-3" />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.div
        className="bg-white/90 border border-darkGrey p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-extrabold text-center text-darkGrey">Create Account</h2>
        <p className="text-center text-sm text-darkGrey">Join us and get started!</p>

        <Formik
          initialValues={{ fullName: '', username: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6">
            {['fullName', 'username', 'email', 'password'].map((field, idx) => (
              <div key={idx}>
                <label htmlFor={field} className="block text-sm font-medium text-darkGrey mb-1">
                  {field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="flex items-center bg-white/20 border border-darkGrey/30 rounded-xl p-3">
                  {fieldIcons[field]}
                  <Field
                    type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
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
              className="w-full py-3 px-4 rounded-2xl font-semibold text-white shadow-md transition duration-300
              bg-pink-500 hover:bg-pink-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Register
            </button>
          </Form>
        </Formik>

        <p className="text-center text-sm text-darkGrey">
          Already have an account?{' '}
          <a href="/" className="text-pink-400 hover:text-pink-500 underline">
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
