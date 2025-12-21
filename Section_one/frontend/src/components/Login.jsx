import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import useUserContext from '../UserContext';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Password is required')
});

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Please Enter your password')
    .matches(
      "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
});

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { setLoggedIn } = useUserContext();
  const [avatarPath, setAvatarPath] = useState('');

  const loginForm = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values, action) => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user/authenicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (res.status === 200) {
        const data = await res.json();
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        setLoggedIn(true);
        Swal.fire({ icon: 'success', title: 'Login Success', timer: 1500, showConfirmButton: false });
        navigate('/home');
      } else if (res.status === 401) {
        Swal.fire({ icon: 'error', title: 'Login Failed', text: 'Invalid Email or Password' });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong' });
      }
      action.resetForm();
    }
  });

  const signupForm = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: SignupSchema,
    onSubmit: async (values, action) => {
      values.avatar = avatarPath;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (res.status === 200) {
        Swal.fire({ icon: 'success', title: 'Signup Success', text: 'Please Login to continue' });
        action.resetForm();
        setIsSignup(false); // Switch to login view
      } else {
        Swal.fire({ icon: 'error', title: 'Signup Failed', text: 'Could not create account' });
      }
    }
  });

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append('myfile', file);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/util/uploadfile`, {
      method: 'POST',
      body: fd
    });

    if (res.status === 200) {
      const data = await res.json();
      setAvatarPath(data.fileName);
    }
  };

  return (
    <div className='loginbg min-vh-100 d-flex justify-content-center align-items-center py-5'>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4 glass-navbar" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
              <div className="card-body p-5">

                {/* Header - Simplified */}
                <div className="text-center mb-5">
                  <h2 className="fw-bold text-dark">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                  <p className="text-muted small">{isSignup ? 'Join our community of artisans' : 'Please enter your details to sign in'}</p>
                </div>

                {/* Forms */}
                {!isSignup ? (
                  /* Login Form */
                  <form onSubmit={loginForm.handleSubmit}>
                    <div className="form-floating mb-3">
                      <input
                        className={`form-control rounded-3 ${loginForm.touched.email && loginForm.errors.email ? 'is-invalid' : ''}`}
                        id="loginEmail"
                        type="email"
                        {...loginForm.getFieldProps('email')}
                        placeholder="name@example.com"
                      />
                      <label htmlFor="loginEmail">Email Address</label>
                      <div className="invalid-feedback">{loginForm.errors.email}</div>
                    </div>

                    <div className="form-floating mb-4">
                      <input
                        className={`form-control rounded-3 ${loginForm.touched.password && loginForm.errors.password ? 'is-invalid' : ''}`}
                        id="loginPassword"
                        type="password"
                        {...loginForm.getFieldProps('password')}
                        placeholder="Password"
                      />
                      <label htmlFor="loginPassword">Password</label>
                      <div className="invalid-feedback">{loginForm.errors.password}</div>
                      <div className="text-end mt-2">
                        <a href="#" className="small text-muted text-decoration-none">Forgot Password?</a>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-sm mb-4">
                      Sign In
                    </button>

                    <div className="text-center">
                      <p className="mb-0 text-muted">Don't have an account?</p>
                      <button
                        type="button"
                        className="btn btn-link text-dark fw-bold text-decoration-none p-0"
                        onClick={() => setIsSignup(true)}
                      >
                        Register here
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Signup Form */
                  <form onSubmit={signupForm.handleSubmit}>
                    <div className="form-floating mb-3">
                      <input
                        className={`form-control rounded-3 ${signupForm.touched.name && signupForm.errors.name ? 'is-invalid' : ''}`}
                        id="signupName"
                        type="text"
                        {...signupForm.getFieldProps('name')}
                        placeholder="John Doe"
                      />
                      <label htmlFor="signupName">Full Name</label>
                      <div className="invalid-feedback">{signupForm.errors.name}</div>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className={`form-control rounded-3 ${signupForm.touched.email && signupForm.errors.email ? 'is-invalid' : ''}`}
                        id="signupEmail"
                        type="email"
                        {...signupForm.getFieldProps('email')}
                        placeholder="name@example.com"
                      />
                      <label htmlFor="signupEmail">Email Address</label>
                      <div className="invalid-feedback">{signupForm.errors.email}</div>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className={`form-control rounded-3 ${signupForm.touched.password && signupForm.errors.password ? 'is-invalid' : ''}`}
                        id="signupPassword"
                        type="password"
                        {...signupForm.getFieldProps('password')}
                        placeholder="Create password"
                      />
                      <label htmlFor="signupPassword">Password</label>
                      <div className="invalid-feedback">{signupForm.errors.password}</div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-muted small ms-1">Profile Picture (Optional)</label>
                      <input type="file" className="form-control rounded-3" onChange={uploadFile} />
                    </div>

                    <button type="submit" className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-sm mb-4">
                      Create Account
                    </button>

                    <div className="text-center">
                      <p className="mb-0 text-muted">Already have an account?</p>
                      <button
                        type="button"
                        className="btn btn-link text-dark fw-bold text-decoration-none p-0"
                        onClick={() => setIsSignup(false)}
                      >
                        Sign in here
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;