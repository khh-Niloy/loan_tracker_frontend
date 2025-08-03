'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useCreateUserMutation } from '@/lib/redux/api/loanApi';
import { setAuth, loadAuthFromStorage } from '@/lib/redux/slices/authSlice';

interface RegistrationForm {
  name: string;
  phoneNumber: string;
}

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createUser] = useCreateUserMutation();
  
  useEffect(() => {
    // Check if already authenticated when component mounts
    dispatch(loadAuthFromStorage());
    
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router, dispatch]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegistrationForm>();

  const onSubmit = async (data: RegistrationForm) => {
    setIsLoading(true);
    try {
      const response = await createUser(data).unwrap();
      const { newUser, token } = response.data;
      
      // Store user info and navigate to home
      // The backend cookie will handle authentication
      dispatch(setAuth({
        user: {
          name: newUser.name,
          phoneNumber: newUser.phoneNumber
        },
        token: token
      }));
      
      router.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-vanilla to-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center slide-in">
          <h1 className="text-4xl font-display font-medium text-charcoal mb-2">LoanTracker</h1>
          <h2 className="text-xl font-display font-light text-gray-600">
            {`Let's get you started`}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create your account to start tracking loans
          </p>
        </div>

        <div className="card-modern slide-in" style={{animationDelay: '0.1s'}}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  id="name"
                  type="text"
                  className="input-modern w-full placeholder-gray-400 focus:border-coral"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-sm text-coral mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 mb-2">
                  Phone Number
                </label>
                <input
                  {...register('phoneNumber', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  id="phoneNumber"
                  type="tel"
                  className="input-modern w-full placeholder-gray-400 focus:border-coral"
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <p className="text-sm text-coral mt-1">{errors.phoneNumber.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-peach-coral text-black font-medium py-3 px-6 rounded-xl hover:shadow-soft-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="loading-dots">Creating account</span>
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 font-light">
            By creating an account, you agree to track your loans responsibly
          </p>
        </div>
      </div>
    </div>
  );
}