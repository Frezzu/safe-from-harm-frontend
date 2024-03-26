'use server';

import { z } from "zod";
import { set, update } from 'lodash';
import { Account, Certificate } from "./data";

const MEMBERSHIP_NUMBER_REGEX = /^[A-Za-z]{2}[0-9]{9}$/;

const AccountSchema = z.object({
  firstName: z.string()
    .min(1, 'Imię jest wymagane.'),
  lastName: z.string()
    .min(1, 'Nazwisko jest wymagane.'),
  membershipNumber: z.string()
    .min(1, 'Numer ewidencyjny jest wymagany.')
    .regex(MEMBERSHIP_NUMBER_REGEX, 'Numer ewidencyjny jest niepoprawny.'),
});

export type CreateAccountsState = {
  accounts?: Account[],
  errors?: {
    firstName: string[];
    lastName: string[];
    membershipNumber: string[]
  }[];
  message?: string;
};

export async function createAccounts(prevState: CreateAccountsState, formData: FormData): Promise<CreateAccountsState> {
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

export type VerifyCertificatesState = {
  certificates?: Certificate[];
  message?: string;
};

export async function verifyCertificates(prevState: VerifyCertificatesState, formData: FormData): Promise<VerifyCertificatesState> {
  const membershipNumbers = [...new Set(
    formData.get('membership-numbers')
      ?.toString()
      ?.split('\n')
      ?.map(line => line.trim())
      ?.filter(line => line.length)
  )];

  if (!membershipNumbers?.length) {
    return {
      message: 'Numery ewidencyjne są wymagane.'
    };
  }

  const invalidMembershipNumbers = membershipNumbers?.filter(membershipNumber => !MEMBERSHIP_NUMBER_REGEX.test(membershipNumber));

  if (invalidMembershipNumbers?.length) {
    return {
      message: invalidMembershipNumbers.length > 1
        ? `Numery ewidencyjne ${invalidMembershipNumbers.map(n => `"${n}"`).join(', ')} są niepoprawne.`
        : `Numer ewidencyjny "${invalidMembershipNumbers[0]}" jest niepoprawny.`,
    }
  }

  return {
    certificates: membershipNumbers?.map(membershipNumber => ({
      membershipNumber,
      status: 'Valid',
      validUntil: new Date(),
    })),
  };
}
