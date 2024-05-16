import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateData,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = (req, res) => {
  listContacts()
    .then((contacts) => res.status(200).json(contacts))
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const getOneContact = (req, res) => {
  getContactById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const deleteContact = (req, res) => {
  removeContact(req.params.id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((error) => console.error("Error:", error));
};

export const createContact = (req, res) => {
  const { name, email, phone } = req.body;
  const { error } = createContactSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json(error.details.map((error) => error.message).join(", "));
  }

  addContact(name, email, phone)
    .then((newContact) => res.status(201).json(newContact))
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

export const updateContact = (req, res) => {
  const id = req.params.id;
  const contact = req.body;

  if (Object.keys(contact).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  const { error } = updateContactSchema.validate(contact, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  updateData(id, contact)
    .then((updatedContact) => {
      if (updatedContact) {
        res.status(200).json(updatedContact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};
