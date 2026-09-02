import { useMutation, useQuery } from "@tanstack/react-query";
import { membershipApi } from "./membership.api";

export function useMembershipPlans() {
  return useQuery({ queryKey: ["membership", "plans"], queryFn: membershipApi.plans });
}

export function useMembershipStatus() {
  return useQuery({ queryKey: ["membership", "status"], queryFn: membershipApi.status });
}

export function useMembershipCheckout() {
  return useMutation({
    mutationFn: (planId: string) => membershipApi.checkout(planId),
    // ✅ Fix: Auto-redirect ke payment gateway setelah mendapat checkoutUrl
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
  });
}