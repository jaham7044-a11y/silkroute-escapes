import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { sendContactEnquiryEmail } from "../contact/contact-email.server";
import { createContactDebugId, logContactError, logContactInfo } from "../contact/contact-log.server";

const contactInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("A valid email is required."),
  phone: z.string().trim().optional(),
  country: z.string().trim().optional(),
  dates: z.string().trim().optional(),
  travelers: z.coerce.number().int().min(1).optional(),
  destinations: z.string().trim().optional(),
  budget: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export const submitContactEnquiry = createServerFn({ method: "POST" })
  .validator(contactInputSchema)
  .handler(async ({ data }) => {
    const debugId = createContactDebugId();

    logContactInfo("Contact enquiry submission received", {
      debugId,
      customerEmail: data.email,
      customerName: data.name,
      hasPhone: Boolean(data.phone),
      hasMessage: Boolean(data.message),
      destinations: data.destinations ?? null,
    });

    try {
      await sendContactEnquiryEmail({
        debugId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        dates: data.dates,
        travelers: data.travelers,
        destinations: data.destinations,
        budget: data.budget,
        message: data.message,
      });

      logContactInfo("Contact enquiry submission succeeded", {
        debugId,
        customerEmail: data.email,
        customerName: data.name,
      });

      return {
        success: true as const,
        message: "Your message has been sent successfully.",
      };
    } catch (error) {
      logContactError("Contact enquiry submission failed", error, {
        debugId,
        customerEmail: data.email,
        customerName: data.name,
      });

      const isConfigError =
        error instanceof Error && error.message.includes("Email is not configured");

      return {
        success: false as const,
        message: isConfigError
          ? `Contact form is temporarily unavailable. Please email us directly. Ref: ${debugId}`
          : `Unable to send your message. Please try again. Ref: ${debugId}`,
      };
    }
  });
