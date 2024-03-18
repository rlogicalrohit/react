import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Confetti from 'react-confetti';
import bcrypt from 'bcryptjs';

const Add = () => {
  const user = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const [users, setUsers] = useState(user);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUsers({ ...users, [name]: value });
    // Clear the error message when user starts typing again
    setErrors({ ...errors, [name]: "" });
    console.log("errors", errors);
  }

  const validateForm = () => {
    const newErrors = {};
    // Validation logic for each field
    if (users.name.trim() === "") {
      newErrors.name = "Please enter your name";
    }
    if (users.email.trim() === "") {
      newErrors.email = "Please enter your email";
    } else if (!isValidEmail(users.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (users.password.trim() === "") {
      newErrors.password = "Please enter a password";
    }
    if (users.confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please confirm your password";
    }
    if (users.password !== users.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const isValidEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const submitRegistrationForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const saltRounds = 10; // Number of salt rounds for bcrypt
    bcrypt.hash(users.password, saltRounds, function (err, hash) {
      if (err) {
        console.error('Error hashing password:', err);
      } else {
        console.log("ITS A HASHHH PASSWORDD  ", hash);

        users.password = hash;
        users.confirmPassword = hash;

        axios.post("http://localhost:4000/register", users)
          .then((res) => {
            console.log("Data Stored successfully", res);
            toast.success("User Created successfully", { position: "top-right" });
            setShowConfetti(true);
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          })
          .catch((err) => {
            console.log("err", err);
            toast.error((err.response.data?.message || err.response.data), { position: "top-right" });
          })
      }
    });
  }

  console.log("REGISTER USER");

  return (
  //   <section class="gradient-form h-full bg-neutral-200 dark:bg-neutral-700">
  //   <div class="container h-full p-10">
  //     <div
  //       class="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
  //       <div class="w-full">
  //         <div
  //           class="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
  //           <div class="g-0 lg:flex lg:flex-wrap">
  //             <div class="px-4 md:px-0 lg:w-6/12">
  //               <div class="md:mx-6 md:p-12">
  //                 <div class="text-center">
  //                   <img
  //                     class="mx-auto w-48"
  //                     src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
  //                     alt="logo" />
  //                   <h4 class="mb-12 mt-1 pb-1 text-xl font-semibold">
  //                     We are The Lotus Team
  //                   </h4>
  //                 </div>
  
  //                 <form>
  //                   <p class="mb-4">Please register an account</p>
  //                   <div class="relative mb-4" data-twe-input-wrapper-init>
  //                     <input
  //                       type="text"
  //                       class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
  //                       id="exampleFormControlInput1"
  //                       placeholder="Username" />
  //                     <label
  //                       for="exampleFormControlInput1"
  //                       class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
  //                       >Email address
  //                     </label>
  //                   </div>
  
  //                   <div class="relative mb-4" data-twe-input-wrapper-init>
  //                     <input
  //                       type="password"
  //                       class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
  //                       id="exampleFormControlInput11"
  //                       placeholder="Password" />
  //                     <label
  //                       for="exampleFormControlInput11"
  //                       class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
  //                       >Password
  //                     </label>
  //                   </div>
  
  //                   <div class="mb-12 pb-1 pt-1 text-center">
  //                     <button
  //                       class="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
  //                       type="button"
  //                       data-twe-ripple-init
  //                       data-twe-ripple-color="light"
  //                       style="
  //                         background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);
  //                       ">
  //                       Sign up
  //                     </button>
  
  //                     <a href="#!">Terms and conditions</a>
  //                   </div>
  
  //                   <div class="flex items-center justify-between pb-6">
  //                     <p class="mb-0 me-2">Have an account?</p>
  //                     <button
  //                       type="button"
  //                       class="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-danger-50/50 hover:text-danger-600 focus:border-danger-600 focus:bg-danger-50/50 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-rose-950 dark:focus:bg-rose-950"
  //                       data-twe-ripple-init
  //                       data-twe-ripple-color="light">
  //                       Login
  //                     </button>
  //                   </div>
  //                 </form>
  //               </div>
  //             </div>
  
  //             <div
  //               class="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-e-lg lg:rounded-bl-none"
  //               style="background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)">
  //               <div class="px-4 py-6 text-white md:mx-6 md:p-12">
  //                 <h4 class="mb-6 text-xl font-semibold">
  //                   We are more than just a company
  //                 </h4>
  //                 <p class="text-sm">
  //                   Lorem ipsum dolor sit amet, consectetur adipisicing
  //                   elit, sed do eiusmod tempor incididunt ut labore et
  //                   dolore magna aliqua. Ut enim ad minim veniam, quis
  //                   nostrud exercitation ullamco laboris nisi ut aliquip ex
  //                   ea commodo consequat.
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </section>
    <section className="flex flex-col items-center pt-6">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Create an
            account
          </h1>
          {showConfetti && <Confetti width={800} height={600} />}
          <form className="space-y-4 md:space-y-6" method="POST" onSubmit={submitRegistrationForm}>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your full name</label>
              <input type="text" onChange={inputHandler} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Emelia Erickson" required="" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input type="text" onChange={inputHandler} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="xyz@gmail.com" required="" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" onChange={inputHandler} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
              <input type="password" onChange={inputHandler} name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create an account</button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">Already have an account? <button
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"><Link to="/login">Sign in here</Link></button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Add;
