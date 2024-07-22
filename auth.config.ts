import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { axiosInstance } from './lib/axios/axios';
import { cookies } from 'next/headers';
import { parse } from 'cookie';

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const response = await axiosInstance().post(
          '/login',
          {
            email: credentials.email,
            password: credentials.password
          },
          { withCredentials: true }
        );

        const apiCookies = response.headers['set-cookie'];
        if (apiCookies && apiCookies.length > 0) {
          apiCookies.forEach((cookie) => {
            const parsedCookie = parse(cookie);
            const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];
            const httpOnly = cookie.includes('httponly;');

            cookies().set({
              name: cookieName,
              value: cookieValue,
              httpOnly: httpOnly,
              maxAge: parseInt(parsedCookie['Max-Age']),
              path: parsedCookie.path,
              sameSite:
                parsedCookie.samesite === 'none'
                  ? 'none'
                  : parsedCookie.samesite === 'lax'
                  ? 'lax'
                  : parsedCookie.samesite === 'strict'
                  ? 'strict'
                  : true,
              expires: new Date(parsedCookie.expires),
              secure: true
            });
          });
        }

        if (response.data) {
          return response.data;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
