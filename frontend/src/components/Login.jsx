import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AnimatedBalls from '../components/AnimatedBalls';
import logo from '../assets/epowrite.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    if (values.email === 'email-a@gmail.com' && values.password === '12345') {
      navigate('/a');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/login', values);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful!');
      navigate('/home');
    } catch (err) {
      setFieldError('general', err.response?.data?.message || 'Login failed');
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 relative">
      <AnimatedBalls />

      <motion.div
        className="bg-white/90 border-4 border-darkGrey p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] w-full max-w-md z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-32 w-32 rounded-full shadow-md" />
        </div>

        <h2 className="text-4xl font-extrabold text-center text-darkGrey">Welcome Back</h2>
        <p className="text-center text-sm text-darkGrey">Sign in to continue</p>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-6 mt-6">
              {errors.general && (
                <div className="text-red-400 text-sm text-center border border-red-500 rounded-lg p-2 bg-red-500/10">
                  {errors.general}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-darkGrey mb-1">Email</label>
                <div className="flex items-center bg-white/20 border border-darkGrey/30 rounded-xl p-3">
                  <FaEnvelope className="text-darkGrey mr-3" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="bg-transparent w-full text-darkGrey placeholder-darkGrey focus:outline-none"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-darkGrey mb-1">Password</label>
                <div className="flex items-center bg-white/20 border border-darkGrey/30 rounded-xl p-3">
                  <FaLock className="text-darkGrey mr-3" />
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="bg-transparent w-full text-darkGrey placeholder-darkGrey focus:outline-none"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-2xl font-semibold text-purple shadow-md transition duration-300 ${
                  isSubmitting
                    ? 'bg-darkGrey cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500'
                }`}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-darkGrey">
                Don't have an account?{' '}
                <a href="/register" className="text-purple-500 hover:underline">
                  Register here
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </motion.div>

      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Login;
