export interface Account {
  firstName: string;
  lastName: string;
  membershipNumber: string;
  password: string;
  status:
    | 'Success'
    | 'MemberNotInTipi'
    | 'MemberHasMs365'
    | 'MemberAlreadyHasMoodle';
}

export interface Certificate {
  membershipNumber: string;
  validUntil?: Date;
  status: 'Valid' | 'Invalid' | 'MemberNotFound';
}
