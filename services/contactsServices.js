import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contactList = await listContacts();
  const contact = contactList.find((contact) => contact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [delContact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return delContact;
}

async function addContact(name, email, phone) {
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  const allContacts = await listContacts();
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return newContact;
}

async function updateData(id, updatedData) {
  const contacts = await listContacts();
  const contactIdx = contacts.findIndex((contact) => contact.id === id);

  if (contactIdx === -1) {
    return null;
  }

  const updatedContact = { ...contacts[contactIdx], ...updatedData };
  contacts[contactIdx] = updatedContact;

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return updatedContact;
}

export { listContacts, getContactById, removeContact, addContact, updateData };
