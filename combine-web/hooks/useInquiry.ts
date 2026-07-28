import { useInquiry as useInquiryContext } from "@/components/providers/InquiryProvider";

export function useInquiry() {
  return useInquiryContext();
}