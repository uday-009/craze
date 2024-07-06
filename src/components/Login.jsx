// src/app/components/Login.jsx
"use client"
import React, { useState } from 'react';
import requests from '../lib/httpService'; // Adjust the path if necessary
import loginBackground from '../../public/assets/images/login-hero.png';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await requests.post('/users/login', { email, password });
            if(response.status){
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                router.push('/dashboard')
                toast.success(response.message);
            }else{
                toast.error('please try again, some error', response.message)
            }
            // Handle successful login, e.g., redirect to the dashboard or store user info
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login failure
        }
    };

    return (
        <div>
           <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div className="m-0  bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="w-7/12 p-6 sm:p-12">
            
            <div className="mt-12 flex flex-col items-center">
              
                <div className="w-full flex-1 mt-8 p-[54px]">
                    

                    <div className="my-12 border-b text-center">
                        <div
                            className="leading-none px-2 inline-block text-2xl text-gray-400 tracking-wide font-medium bg-white transform translate-y-1/2">
                           welcome to <b className='text-gray-900'>Cash Craze Game</b>
                        </div>
                    </div>

                    <div className="mx-auto">
                        <div className="flex items-center justify-center gap-4">

                            <span className='flex-1'>
                                <label htmlFor="email">User Name</label>
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    id="email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            </span>
                            <span className='flex-1'>
                                <label htmlFor="password"> Password </label>
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            </span>
                        </div>
                        <div className='flex justify-center items-center gap-4 mt-[60px]'>

                            <button
                                className="max-w-[224px]  font-semibold bg-[#1565D8] text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                onClick={handleLogin}
                                >
                                
                                <span className="ml-3">
                                    Login
                                </span>
                            </button>
                            <button
                                className="max-w-[224px]   font-semibold bg-white text-[#1565D8] w-full py-4 rounded-lg hover:bg-[#1565D8] hover:text-[#fff] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none border border-[#1565D8]">
                                
                                <span className="ml-3">
                                    Cancel
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-5/12 bg-[#eaeefa80] text-center hidden lg:flex">
            <div className="m-12 xl:m-16 w-full bg-transparent bg-center bg-no-repeat flex items-center justify-center" >
                    <Image
                        src={loginBackground}
                        alt="Picture of the login banner"
                        style={{borderRadius: '14px', height: '379px', width: '454px'}}
                    />
            </div>
        </div>
    </div>
</div>
        </div>
    );
};

export default Login;
