"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface ContactItem {
  id: string;
  type: 'Requester contact' | 'Billing contact';
  name: string;
  role: string;
  email: string;
  phone: string;
  isDefault: boolean;
  isArchived?: boolean;
}

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  room: string;
  parking: string;
  entrance: string;
  instructions: string;
  isDefault: boolean;
  isArchived?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface ClientItem {
  id: string;
  name: string;
  type: string;
  contact: string;
  stats: string;
  contacts?: ContactItem[];
  locations?: LocationItem[];
  isArchived?: boolean;
  generalEmail?: string;
  generalPhone?: string;
  billingOrg?: string;
  billingAddress?: string;
  privateNotes?: string;
  auditLogs?: AuditLog[];
}

interface ClientsContextType {
  clients: ClientItem[];
  addClient: (client: ClientItem) => void;
  updateClient: (clientId: string, updates: Partial<ClientItem>) => void;
  archiveClient: (clientId: string) => void;
  restoreClient: (clientId: string) => void;
  deleteClient: (clientId: string) => void;
  addContact: (clientId: string, newContact: ContactItem) => void;
  archiveContact: (clientId: string, contactId: string) => void;
  restoreContact: (clientId: string, contactId: string) => void;
  deleteContact: (clientId: string, contactId: string) => void;
  makeContactDefault: (clientId: string, contactId: string) => void;
  addLocation: (clientId: string, newLocation: LocationItem) => void;
  archiveLocation: (clientId: string, locationId: string) => void;
  restoreLocation: (clientId: string, locationId: string) => void;
  deleteLocation: (clientId: string, locationId: string) => void;
  makeLocationDefault: (clientId: string, locationId: string) => void;
}

const defaultClients: ClientItem[] = [
  { 
    id: '1', 
    name: 'Fictional clinic', 
    type: 'Organization', 
    contact: 'vegan4me@gmail.com · 2533943781', 
    stats: '0 contacts · 0 locations · 0 linked jobs' 
  }
];

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientItem[]>(defaultClients);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("terpdesk_clients");
    if (saved) {
      try {
        setClients(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse clients from local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("terpdesk_clients", JSON.stringify(clients));
    }
  }, [clients, isLoaded]);

  const createAuditLog = (action: string, details: string): AuditLog => ({
    id: Date.now().toString() + Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    user: "Avery North",
    action,
    details
  });

  const addClient = (client: ClientItem) => {
    const log = createAuditLog("Client created", `Client created - ${client.name}`);
    const clientWithLog = { ...client, auditLogs: [log, ...(client.auditLogs || [])] };
    setClients((prev) => [clientWithLog, ...prev]);
  };

  const addContact = (clientId: string, newContact: ContactItem) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        let contacts = client.contacts ? [...client.contacts] : [];
        if (newContact.isDefault) {
          contacts = contacts.map(c => c.type === newContact.type ? { ...c, isDefault: false } : c);
        }
        contacts.push(newContact);
        return { ...client, contacts };
      }
      return client;
    }));
  };

  const archiveContact = (clientId: string, contactId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId && client.contacts) {
        return { 
          ...client, 
          contacts: client.contacts.map(c => 
            c.id === contactId ? { ...c, isArchived: true, isDefault: false } : c
          )
        };
      }
      return client;
    }));
  };

  const restoreContact = (clientId: string, contactId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId && client.contacts) {
        return { 
          ...client, 
          contacts: client.contacts.map(c => 
            c.id === contactId ? { ...c, isArchived: false } : c
          )
        };
      }
      return client;
    }));
  };

  const deleteContact = (clientId: string, contactId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId && client.contacts) {
        return { ...client, contacts: client.contacts.filter(c => c.id !== contactId) };
      }
      return client;
    }));
  };

  const makeContactDefault = (clientId: string, contactId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId && client.contacts) {
        const targetContact = client.contacts.find(c => c.id === contactId);
        if (targetContact) {
          const updatedContacts = client.contacts.map(c => 
            c.type === targetContact.type
              ? { ...c, isDefault: c.id === contactId }
              : c
          );
          return { ...client, contacts: updatedContacts };
        }
      }
      return client;
    }));
  };

  const addLocation = (clientId: string, newLocation: LocationItem) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        let locations = client.locations ? [...client.locations] : [];
        if (newLocation.isDefault) {
          locations = locations.map(l => ({ ...l, isDefault: false }));
        }
        locations.push(newLocation);
        return { ...client, locations };
      }
      return client;
    }));
  };

  const archiveLocation = (clientId: string, locationId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId && client.locations) {
        return { 
          ...client, 
          locations: client.locations.map(l => 
            l.id === locationId ? { ...l, isArchived: true, isDefault: false } : l
          )
        };
      }
      return client;
    }));
  };

  const restoreLocation = (clientId: string, locationId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId && client.locations) {
        return { 
          ...client, 
          locations: client.locations.map(l => 
            l.id === locationId ? { ...l, isArchived: false } : l
          )
        };
      }
      return client;
    }));
  };

  const deleteLocation = (clientId: string, locationId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId && client.locations) {
        return { ...client, locations: client.locations.filter(l => l.id !== locationId) };
      }
      return client;
    }));
  };

  const makeLocationDefault = (clientId: string, locationId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId && client.locations) {
        const updatedLocations = client.locations.map(l => 
          ({ ...l, isDefault: l.id === locationId })
        );
        return { ...client, locations: updatedLocations };
      }
      return client;
    }));
  };

  const archiveClient = (clientId: string) => {
    const log = createAuditLog("Client archived", "Client was archived");
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, isArchived: true, auditLogs: [log, ...(c.auditLogs || [])] } : c));
  };

  const restoreClient = (clientId: string) => {
    const log = createAuditLog("Client restored", "Client was restored from archive");
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, isArchived: false, auditLogs: [log, ...(c.auditLogs || [])] } : c));
  };

  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const updateClient = (clientId: string, updates: Partial<ClientItem>) => {
    const log = createAuditLog("Client updated", "Client details were updated");
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates, auditLogs: [log, ...(c.auditLogs || [])] } : c));
  };

  if (!isLoaded) return null;

  return (
    <ClientsContext.Provider value={{ 
      clients, 
      addClient, 
      updateClient,
      archiveClient,
      restoreClient,
      deleteClient,
      addContact, 
      archiveContact, 
      restoreContact,
      deleteContact,
      makeContactDefault, 
      addLocation, 
      archiveLocation, 
      restoreLocation,
      deleteLocation,
      makeLocationDefault 
    }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
}
