import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Organization {
  name: string;
  business_id: string;
  economic_area: string;
  respondent: string;
  respondent_email: string;
  respondent_phone: string;
  description: string;
  dates: string;
  participants: string;
  impact: string;
  notes: string;
}

export interface OrganizationState {
  organization: Organization;
  setOrganization: (data: Partial<Organization>) => void;
  clearOrganization: () => void;
}

export const initialState: Organization = {
  name: "",
  business_id: "",
  economic_area: "",
  respondent: "",
  respondent_email: "",
  respondent_phone: "",
  description: "",
  dates: "",
  participants: "",
  impact: "",
  notes: "",
};

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      organization: initialState,
      setOrganization: (data) =>
        set((state) => ({
          organization: { ...state.organization, ...data },
        })),
      clearOrganization: () => {
        // Remove the organization-storage item
        localStorage.removeItem("organization-storage");

        // Then update the state with initial values
        set({ organization: initialState });
      },
    }),
    {
      name: "organization-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
