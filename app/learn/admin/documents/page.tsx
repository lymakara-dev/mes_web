"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import { Document as Doc, DocumentApi } from "@/hooks/learn/document-api";

const documentApi = DocumentApi();

export default function DocumentManagementPage() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Doc | null>(null);
  const [deleteDocumentId, setDeleteDocumentId] = useState<number | null>(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentApi.getDocuments();
      setDocuments(data);
    } catch {
      addToast({ title: "Failed to load documents", color: "danger" });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setSelectedDocument(null);
  };

  const handleSubmit = async () => {
    if (!title) {
      addToast({ title: "Title is required", color: "warning" });
      return;
    }
    try {
      if (selectedDocument) {
        await documentApi.updateDocument(
          selectedDocument.id,
          { title, description },
          file || undefined,
        );
        addToast({ title: "Document updated", color: "success" });
      } else {
        await documentApi.createDocument(
          { title, description },
          file || undefined,
        );
        addToast({ title: "Document created", color: "success" });
      }
      fetchDocuments();
      resetForm();
    } catch {
      addToast({ title: "Failed to save document", color: "danger" });
    }
  };

  const handleEdit = (doc: Doc) => {
    setSelectedDocument(doc);
    setTitle(doc.title);
    setDescription(doc.description || "");
  };

  const handleDelete = async () => {
    if (!deleteDocumentId) return;
    try {
      await documentApi.deleteDocument(deleteDocumentId);
      setDocuments(documents.filter((d) => d.id !== deleteDocumentId));
      addToast({ title: "Document deleted", color: "success" });
    } catch {
      addToast({ title: "Failed to delete document", color: "danger" });
    } finally {
      setDeleteDocumentId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Document Management</h1>

      {/* Document Form */}
      <Card className="p-4 space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="file"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        <Button color="primary" onClick={handleSubmit}>
          {selectedDocument ? "Update Document" : "Create Document"}
        </Button>
      </Card>

      {/* Document List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4 flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-semibold">{doc.title}</p>
              {doc.description && (
                <p className="text-sm text-gray-500">{doc.description}</p>
              )}
              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  className="text-blue-500"
                  rel="noreferrer"
                >
                  View File ({doc.fileType}, {(doc.fileSize || 0) / 1024} KB)
                </a>
              )}
              <p className="text-xs text-gray-400">
                Uploaded by: {doc.uploadedBy || "Unknown"} | Created:{" "}
                {new Date(doc.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col gap-2 ml-2">
              <Button size="sm" onClick={() => handleEdit(doc)}>
                Edit
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={() => setDeleteDocumentId(doc.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteDocumentId !== null}
        onClose={() => setDeleteDocumentId(null)}
      >
        <ModalContent>
          <ModalHeader>Delete Document</ModalHeader>
          <ModalBody>Are you sure you want to delete this document?</ModalBody>
          <ModalFooter>
            <Button onClick={() => setDeleteDocumentId(null)}>Cancel</Button>
            <Button color="danger" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
