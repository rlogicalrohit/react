import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const user = {
    email: "",
    password: ""

  }
  const [users, setUsers] = useState(user);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUsers({ ...users, [name]: value })
    setErrors({ ...errors, [name]: "" });
  }
  const isValidEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const submitLoginForm = (e) => {
    e.preventDefault();

    if (!validateForm()) {

      return;
    }

    axios.post("http://localhost:4000/login", users).then((res) => {
      localStorage.setItem("token", res.data.token);
      toast.success("Login successfully", { position: "top-right" });
      navigate("/");

    }).catch((err) => {

      console.log("err", err);
      toast.error((err.response.data?.message || err.response.data), { position: "top-right" });
    })
  }

  const validateForm = () => {
    const newErrors = {};
    // Validation logic for each field
    if (users.email.trim() === "") {
      newErrors.email = "Please enter your email";
    } else if (!isValidEmail(users.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (users.password.trim() === "") {
      newErrors.password = "Please enter a password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  }

  return (
    <div
      className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
          <p className="mt-2 text-gray-500">Sign in below to access your account</p>
        </div>
        <div className="mt-5">
          <form method="POST" onSubmit={submitLoginForm}>
            <div className="relative mt-6">
              <input type="text" name="email" onChange={inputHandler} id="email" placeholder="Email Address" className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" autoComplete="off" />
              <label htmlFor="email" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Email Address</label>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            </div>
            <div className="relative mt-6">
              <input type="password" name="password" onChange={inputHandler} id="password" placeholder="Password" className="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
              <label htmlFor="password" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Password</label>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            </div>
            <div className="my-6">
              <button type="submit" className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none">Sign in</button>
            </div>
            <p className="text-center text-sm text-gray-500">Don&#x27;t have an account yet?
              <Link to="/register"><button
                className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none">Sign
                up
              </button>. </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
{/* <div class="flex min-h-screen w-full w-screen items-center justify-center bg-gray-50 text-gray-600">
  <div class="relative">
    <div class="a-z-10 absolute -left-20 -top-20 hidden h-56 w-56 text-indigo-300 sm:block">
      <svg id="patternId" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="a" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(0.6) rotate(0)">
            <rect x="0" y="0" width="100%" height="100%" fill="none" />
            <path d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5" stroke-width="1" stroke="none" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="800%" height="800%" transform="translate(0,0)" fill="url(#a)" />
      </svg>
    </div>
    <div class="a-z-10 absolute -bottom-20 -right-20 hidden h-28 w-28 text-indigo-300 sm:block">
      <svg id="patternId" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="b" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(0.5) rotate(0)">
            <rect x="0" y="0" width="100%" height="100%" fill="none" />
            <path d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5" stroke-width="1" stroke="none" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="800%" height="800%" transform="translate(0,0)" fill="url(#b)" />
      </svg>
    </div>
    <div class="relative flex flex-col rounded-lg border-gray-400 bg-white px-4 shadow-lg sm:w-[30rem]">
      <div class="flex-auto p-6">
        <div class="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
          <a href="#" class="flex cursor-pointer items-center gap-2 text-indigo-500 no-underline hover:text-indigo-500">
            <span class="flex-shrink-0 text-3xl font-black  tracking-tight opacity-100">React.</span>
          </a>
        </div>
        <h4 class="mb-2 font-medium text-gray-700 xl:text-xl">Welcome to React!</h4>
        <p class="mb-6 text-gray-500">Please sign-in to access your account</p>

        <form id="" class="mb-4" action="#" method="POST">
          <div class="mb-4">
            <label for="email" class="mb-2 inline-block text-xs font-medium uppercase text-gray-700">Email or Username</label>
            <input type="text" class="bg--100 block w-full cursor-text appearance-none rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow" id="email" name="email-username" placeholder="Enter your email or username" autofocus="" />
          </div>
          <div class="mb-4">
            <div class="flex justify-between">
              <label class="mb-2 inline-block text-xs font-medium uppercase text-gray-700" for="password">Password</label>
              <a href="auth-forgot-password-basic.html" class="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500">
                <small class=" ">Forgot Password?</small>
              </a>
            </div>
            <div class="relative flex w-full flex-wrap items-stretch">
              <input type="password" id="password" class="bg--100 relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow" name="password" placeholder="············" />
            </div>
          </div>
          <div class="mb-4">
            <div class="block">
              <input class="mr-2 mt-1 h-5 w-5 appearance-none rounded border border-gray-300 bg-contain bg-no-repeat align-top text-black shadow checked:bg-indigo-500 focus:border-indigo-500 focus:shadow" 
                     type="checkbox" 
                     id="remember-me" 
                     style={{ backgroundImage: "url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3e%3cpath fill=\'none\' stroke=\'%23fff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M6 10l3 3l6-6\'/%3e%3c/svg%3e')" }} 
                     checked />
              <label class="inline-block" for="remember-me"> Remember Me </label>
            </div>
          </div>
          <div class="mb-4">
            <button class="grid w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 px-5 py-2 text-center align-middle text-sm text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none" type="submit">Sign in</button>
          </div>
        </form>

        <p class="mb-4 text-center">
          New on react?
          <a href="#" class="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500"> Create an account </a>
        </p>
      </div>
    </div>
  </div>
</div> */}