import { useParams } from "next/navigation";

export const useMessageId = () => {
  const params = useParams();

  return params.messageId as string;
};
