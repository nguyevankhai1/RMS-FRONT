export default function useMe() {
  const user = useState<any>("user", () => null);
  const setUser = (entity: any) => {
    user.value = { ...user.value, ...entity };
  };

  return {
    user,
    setUser,
  };
}
