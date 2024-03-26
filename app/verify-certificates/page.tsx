'use client';

import { VerifyCertificatesState, verifyCertificates } from "@/lib/actions";
import { Certificate } from "@/lib/data";
import clsx from "clsx";
import { useFormState } from "react-dom";

const StatusMapping: Record<string, string> = {
  Invalid: 'Członek nie posiada ważnego certyfikatu.',
  MemberNotFound: 'Nie znaleziono aktywnego członka w Harcerskim Serwisie Szkoleniowym.',
};

export default function VerifyCertificates() {
  const [formState, formAction] = useFormState<VerifyCertificatesState, FormData>(verifyCertificates, {});

  return (
    <main className="container mx-auto py-12 px-8">
      <div className="flex flex-col gap-8 items-center">
        <div className="w-full max-w-4xl prose">
          <h2>Zweryfikuj certyfikaty</h2>
        </div>

        <div className="w-full max-w-4xl">
          {
            formState.certificates?.length
              ? <VerifiedCertificates certificates={formState.certificates} />
              : <VerifyCertificatesForm action={formAction} state={formState} />
          }
        </div>
      </div>
    </main>
  )
}

function VerifiedCertificates({ certificates }: { certificates?: Certificate[] }) {
  return (
    <div className="w-full max-w-4xl flex-grow">
      <div className="overflow-x-auto">
        <table className="table table-lg">
          <thead>
            <tr>
              <th></th>
              <th>Numer ewidencyjny</th>
              <th>Certyfikat ważny do</th>
            </tr>
          </thead>
          <tbody>
            {
              certificates?.map((certificate, index) =>
                <tr key={index} className={clsx({ 'text-error': certificate.status !== 'Valid' })}>
                  <th>{index + 1}</th>
                  <td>{certificate.membershipNumber}</td>
                  <td>{StatusMapping[certificate.status] ?? certificate.validUntil?.toLocaleDateString() ?? 'Nieznany błąd'}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VerifyCertificatesForm({ action, state }: { action: (data: FormData) => void; state: VerifyCertificatesState }) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="form-control">
        <div className="label">
          <span className="label-text">Numery ewidencyjne</span>
        </div>
        <textarea
          className={clsx('textarea textarea-bordered h-48', { 'textarea-error': state?.message })}
          name="membership-numbers"
          placeholder={['AB123456789', 'CD234567891', 'EF345678912'].join('\n')}
          required
        />
      </label>

      {state.message &&
        <div role="alert" className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{state.message}</span>
        </div>
      }

      <button type="submit" className="btn btn-primary">Zweryfikuj</button>
    </form>
  );
}