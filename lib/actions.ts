'use server';

import { z } from "zod";
import { set, update } from 'lodash';
import { Account } from "./data";

export type State = {
  accounts?: Account[],
  errors?: {
    firstName: string[];
    lastName: string[];
    membershipNumber: string[]
  }[];
  message?: string;
};

const AccountSchema = z.object({
  firstName: z.string()
    .min(1, 'Imię jest wymagane!'),
  lastName: z.string()
    .min(1, 'Nazwisko jest wymagane!'),
  membershipNumber: z.string()
    .min(1, 'Numer ewidencyjny jest wymagany!')
    .regex(/^[A-Za-z]{2}[0-9]{9}$/, 'Numer ewidencyjny jest niepoprawny!'),
});

export async function createAccounts(prevState: State, formData: FormData): Promise<State> {
  const { accounts } = Array.from(formData.entries())
    .filter(([key]) => !key.startsWith('$ACTION_'))
    .reduce(
      (acc, [key, value]) => {
        set(acc, key, value);
        return acc;
      },
      { accounts: [] }
    );

  const validatedFields = z.array(AccountSchema).safeParse(accounts);


  if (!validatedFields.success) {
    return {
      errors: Object.values(validatedFields.error.issues.reduce(
        (acc, issue) => {
          update(acc, issue.path, (v) => v ? [...v, issue.message] : [issue.message]);
          return acc;
        },
        {}
      )),
      message: 'Uzupełnij brakujące pola lub popraw błędne dane.',
    };
  }


  return {
    accounts: validatedFields.data.map(account => ({ ...account, status: 'Success', password: 'Test123!' }))
  };
}
