"use client";

import React, { useEffect, useState } from "react";
import { School, SchoolApi } from "@/hooks/learn/school-api";
import {
  Card,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

const schoolApi = SchoolApi();

export default function ManageSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deleteSchoolId, setDeleteSchoolId] = useState<number | null>(null);

  const fetchSchools = async () => {
    const data = await schoolApi.getAll();
    setSchools(data);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Please enter school name");

    if (editingSchool) {
      await schoolApi.update(editingSchool.id, name, file || undefined);
      setEditingSchool(null);
    } else {
      if (!file) return alert("Please upload school logo");
      await schoolApi.create(name, file);
    }

    setName("");
    setFile(null);
    fetchSchools();
  };

  const handleDelete = async () => {
    if (deleteSchoolId !== null) {
      await schoolApi.remove(deleteSchoolId);
      setDeleteSchoolId(null);
      fetchSchools();
    }
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setName(school.name);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Manage Schools</h2>

      {/* Form */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            label="School Name"
            placeholder="Enter school name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="file"
            label="School Logo"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button color="primary" onClick={handleSubmit}>
              {editingSchool ? "Update" : "Create"}
            </Button>
            {editingSchool && (
              <Button
                color="secondary"
                onClick={() => {
                  setEditingSchool(null);
                  setName("");
                  setFile(null);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* School List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schools.map((school) => (
          <Card
            key={school.id}
            className="flex flex-row justify-between items-center p-4"
          >
            <div className="flex items-center gap-3">
              {school.logoUrl && (
                <img
                  src={school.logoUrl}
                  alt={school.name}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <p>{school.name}</p>
            </div>
            <div className="flex gap-2">
              <Button
                color="default"
                size="sm"
                onClick={() => handleEdit(school)}
              >
                Edit
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => setDeleteSchoolId(school.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteSchoolId !== null}
        onClose={() => setDeleteSchoolId(null)}
      >
        <ModalContent>
          <ModalHeader>Delete School</ModalHeader>
          <ModalBody>Are you sure you want to delete this school?</ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button color="secondary" onClick={() => setDeleteSchoolId(null)}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
