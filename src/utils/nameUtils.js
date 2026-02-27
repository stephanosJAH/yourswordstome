export const getFirstName = (fullName) => {
  if (!fullName) return 'amigo';
  return fullName.split(' ')[0];
};
