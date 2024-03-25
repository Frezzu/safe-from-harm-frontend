export interface Account {
  firstName: string;
  lastName: string;
  membershipNumber: string;
  password: string;
  status: 'Success' | 'MemberNotInTipi' | 'MemberHasMs365' | 'MemberAlreadyHasMoodle';
}