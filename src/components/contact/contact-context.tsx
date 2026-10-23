"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** Who opened the form: the visitor (a button or link), or the timer by itself. */
export type OpenedBy = "visitor" | "timer";

interface ContactContextValue {
  open: boolean;
  /** What the enquiry is about (e.g. a product), pre-filled in the message. */
  topic: string | null;
  openedBy: OpenedBy;
  openContact: (topic?: string, by?: OpenedBy) => void;
  setOpen: (open: boolean) => void;
}

/** Remembers, for this browser tab's visit, that a message was sent (then the form stops popping up). */
const SENT_KEY = "jh-contact-sent";

export function sentThisVisit(): boolean {
  try {
    return sessionStorage.getItem(SENT_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSent() {
  try {
    sessionStorage.setItem(SENT_KEY, "1");
  } catch {
    // Storage blocked (private mode): the form may keep popping up, which is harmless.
  }
}

const ContactContext = createContext<ContactContextValue | null>(null);

/** Lets any button on the site open the one contact form. */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [openedBy, setOpenedBy] = useState<OpenedBy>("visitor");
  const openContact = useCallback((next?: string, by: OpenedBy = "visitor") => {
    setTopic(next ?? null);
    setOpenedBy(by);
    setOpen(true);
  }, []);
  const value = useMemo(
    () => ({ open, topic, openedBy, openContact, setOpen }),
    [open, topic, openedBy, openContact],
  );
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useContact(): ContactContextValue {
  const value = useContext(ContactContext);
  if (!value) throw new Error("useContact must be used inside <ContactProvider>");
  return value;
}
