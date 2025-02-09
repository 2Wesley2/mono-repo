import { request } from './fetch';
import { LoginResponse, SignUpResponse } from '../types/auth';
import { OwnerUserData } from '../types/user';

export async function checkAuthentication(): Promise<boolean> {
  try {
    const response = await request<{ loggedIn: boolean }>({
      endpoint: '/api/validate-session',
      method: 'GET',
      credentials: 'include'
    });
    return response.loggedIn;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await request<LoginResponse>({
      endpoint: '/api/login',
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export async function signUp(userData: OwnerUserData): Promise<SignUpResponse> {
  try {
    const response = await request<SignUpResponse>({
      endpoint: '/api/signup',
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
}
