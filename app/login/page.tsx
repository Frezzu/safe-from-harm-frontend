'use client';

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <main className="container mx-auto flex flex-grow">
      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Czuwaj!</h1>
            <p className="py-6 leading-7">
              Aby założyć konta dla uczestników szkoleń{' '}
              <span className="whitespace-nowrap text-primary">
                Safe from Harm
              </span>
              , musisz się najpierw zalogować.
            </p>
            <button onClick={() => signIn('azure-ad')} className="btn btn-primary">Zaloguj się</button>
          </div>
        </div>
      </div>
    </main>
  );
}
