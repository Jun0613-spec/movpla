import { useParams } from "next/navigation";

export const usePropertyId = () => {
  const params = useParams();

  return params.propertyId as string;
};
