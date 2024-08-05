export default function useUserZone() {
  const zone = useState<any>(() => []);

  const setZone = (entity: any) => (zone.value = entity);

  return { zone, setZone };
}
