"use client";

import React, { useEffect, useState } from "react";
import { Subject, SubjectApi } from "@/hooks/learn/subject-api";
import {
  Card,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { School, SchoolApi } from "@/hooks/learn/school-api";

const subjectApi = SubjectApi();
const schoolApi = SchoolApi();

export default function ManageSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [name, setName] = useState("");
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState<number | null>(null);

  const fetchSubjects = async () => {
    const data = await subjectApi.getAll();
    setSubjects(data);
  };

  const fetchSchools = async () => {
    const data = await schoolApi.getAll();
    console.log("schoo", data);
    setSchools(data);
  };

  useEffect(() => {
    fetchSubjects();
    fetchSchools();
  }, []);

  // Create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !schoolId) return alert("Please enter all fields");

    if (editingSubject) {
      await subjectApi.update(
        editingSubject.id,
        name,
        schoolId,
        file || undefined,
      );
      setEditingSubject(null);
    } else {
      if (!file) return alert("Please upload subject image");
      await subjectApi.create(name, schoolId, file);
    }

    setName("");
    setFile(null);
    setSchoolId(null);
    fetchSubjects();
  };

  // Edit
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setSchoolId(subject.schoolId);
  };

  // Delete
  const handleDelete = async () => {
    if (deleteSubjectId !== null) {
      await subjectApi.remove(deleteSubjectId);
      setDeleteSubjectId(null);
      fetchSubjects();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <p className="text-2xl font-bold">Manage Subjects</p>

      {/* Form */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            label="Subject Name"
            placeholder="Enter subject name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label="School"
            placeholder="Select school"
            selectedKeys={
              schoolId !== null ? new Set([schoolId.toString()]) : new Set()
            }
            onSelectionChange={(keys) => {
              // keys is a Set<string>
              const firstKey = Array.from(keys)[0];
              setSchoolId(firstKey ? Number(firstKey) : null);
            }}
          >
            {schools.map((school) => (
              <SelectItem key={school.id} id={school.id.toString()}>
                {school.name}
              </SelectItem>
            ))}
          </Select>

          <Input
            type="file"
            label="Subject Image"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button color="primary" onClick={handleSubmit}>
              {editingSubject ? "Update" : "Create"}
            </Button>
            {editingSubject && (
              <Button
                color="secondary"
                onClick={() => {
                  setEditingSubject(null);
                  setName("");
                  setSchoolId(null);
                  setFile(null);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Subject List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className="flex flex-row justify-between items-center p-4"
          >
            <div className="flex items-center gap-3">
              {subject.logoUrl && (
                <img
                  src={subject.logoUrl}
                  alt={subject.name}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <p>{subject.name}</p>
            </div>
            <div className="flex gap-2">
              <Button
                color="default"
                size="sm"
                onClick={() => handleEdit(subject)}
              >
                Edit
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => setDeleteSubjectId(subject.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteSubjectId !== null}
        onClose={() => setDeleteSubjectId(null)}
      >
        <ModalContent>
          <ModalHeader>Delete Subject</ModalHeader>
          <ModalBody>Are you sure you want to delete this subject?</ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button color="secondary" onClick={() => setDeleteSubjectId(null)}>
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
