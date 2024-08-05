export default function useUserRole() {
  const role = useState<string[]>(() => []);

  const setRole = (entity: any) => (role.value = entity);

  return { role, setRole };
}
