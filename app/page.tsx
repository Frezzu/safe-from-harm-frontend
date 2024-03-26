'use client';

import { CreateAccountsState, createAccounts } from "@/lib/actions";
import { Account } from "@/lib/data";
import clsx from "clsx";
import { useState } from "react";
import { useFormState } from "react-dom";


export default function Home() {
  const [formState, formAction] = useFormState<CreateAccountsState, FormData>(createAccounts, {});

  return (
    <main className="container mx-auto py-12 px-8">
      <div className="flex flex-col gap-8 items-center">
        {
          formState.accounts?.length
            ? <CreatedAccounts accounts={formState.accounts} />
            : <CreateAccounts action={formAction} state={formState} />
        }
      </div>
    </main>
  );
}

const StatusMapping = {
  Success: 'Konto zostało utworzone.',
  MemberNotInTipi: 'Nie znaleziono aktywnego członka w Tipi.',
  MemberHasMs365: 'Członek ma konto w MS365. Użyj jego do zalogowania się w Moodle.',
  MemberAlreadyHasMoodle: 'Członek ma już konto w Moodle.',
};

function CreatedAccounts({ accounts }: { accounts: Account[] }) {
  return (
    <>
      <div className="w-full max-w-4xl prose">
        <h2>Utworzone konta</h2>
        <p>
          Konta założone. Poniżej znajduje się lista kont i haseł. Została one też wysłana na Twój adres e-mail
        </p>
      </div>

      <div className="w-full max-w-4xl flex-grow">
        <div className="overflow-x-auto">
          <table className="table table-lg">
            <thead>
              <tr>
                <th></th>
                <th>Członek</th>
                <th>Wynik</th>
                <th>Login / Hasło</th>
              </tr>
            </thead>
            <tbody>
              {accounts?.map((account, index) =>
                <tr key={index} className={clsx({ 'text-error': account.status !== 'Success' })}>
                  <th>{index + 1}</th>
                  <td>{account.firstName} {account.lastName}</td>
                  <td>{StatusMapping[account.status] ?? 'Nieznany błąd'}</td>
                  <td>{account.membershipNumber} / {account.password || ''}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CreateAccounts({ action, state }: { action: (data: FormData) => void; state: CreateAccountsState }) {
  const [accountsCount, setAccountsCount] = useState<number>(1);

  const incrementAccountsCount = () => {
    setAccountsCount(accountsCount + 1);
  };

  return (
    <>
      <div className="w-full max-w-4xl prose">
        <h2>Utwórz konta</h2>
        <p>
          Wpisz dane uczestników szkolenia <span className="whitespace-nowrap">Safe from Harm</span> poniżej.
          Upewnij się, że osoby te są aktywnymi członkami ZHP i nie mają konta w usłudze Microsoft 365.
          Jeśli posiadają takie konto, powinny go użyć do zalogowania się na
          stronie <a href="https://edu.zhp.pl" className="link" target="_blank">edu.zhp.pl</a>.
        </p>
      </div>

      <form action={action} className="flex flex-col w-full max-w-4xl gap-2">
        <div className="overflow-auto">
          {
            Array
              .from({ length: accountsCount })
              .map((_, i) => <FormAccountItem key={i} id={i} errors={state.errors && state.errors[i]} />)
          }
        </div>

        {state.message &&
          <div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{state.message}</span>
          </div>
        }

        <div className="flex flex-wrap mt-4 justify-end gap-2">
          <button type="submit" className="btn btn-primary">Załóż konta</button>
          <button className="btn btn-neutral" formAction={incrementAccountsCount} formNoValidate>Dodaj kolejnego</button>
        </div>
      </form>
    </>
  )
}

function FormAccountItem(
  {
    id,
    errors
  }: {
    id: number,
    errors?: {
      firstName: string[],
      lastName: string[],
      membershipNumber: string[],
    }
  }
) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Imię</span>
        </div>
        <input type="text" name={`accounts.${id}.firstName`} className={clsx(["input input-bordered"], { 'input-error': errors?.firstName?.length })} required />
        <div className="label">
          {errors?.firstName?.map(error => <span key={error} className="label-text-alt text-error">{error}</span>)}
        </div>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Nazwisko</span>
        </div>
        <input type="text" name={`accounts.${id}.lastName`} className={clsx(["input input-bordered"], { 'input-error': errors?.lastName?.length })} required />
        <div className="label">
          {errors?.lastName?.map(error => <span key={error} className="label-text-alt text-error">{error}</span>)}
        </div>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Numer ewidencyjny</span>
        </div>
        <input type="text" name={`accounts.${id}.membershipNumber`} className={clsx(["input input-bordered"], { 'input-error': errors?.membershipNumber?.length })} pattern="^[A-Za-z]{2}[0-9]{9}$" required />
        <div className="label flex-col items-start">
          {errors?.membershipNumber?.map(error => <span key={error} className="label-text-alt text-error">{error}</span>)}
        </div>
      </label>
    </div>
  );
}
