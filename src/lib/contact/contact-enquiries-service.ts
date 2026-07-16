import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const COL = "contactEnquiries";

export type ContactEnquiryInput = {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  dates?: string;
  travelers?: number;
  destinations?: string;
  budget?: string;
  message?: string;
};

export const contactEnquiriesService = {
  async create(input: ContactEnquiryInput): Promise<string> {
    const ref = await addDoc(collection(db, COL), {
      ...input,
      status: "new",
      source: "contact-page",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  },
};
