"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { useAdminApi } from "@/hooks/useAdminApi";
import SchoolModal from "@/components/admin/learn/schoolModel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminSchools() {
  const { getSchools, createSchool, updateSchool, deleteSchool } =
    useAdminApi();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);

  // ✅ Fetch schools
  const {
    data: schools,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  // ✅ Create school mutation
  const createMutation = useMutation({
    mutationFn: (name: string) => createSchool(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });

  // ✅ Update school mutation
  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; name: string }) =>
      updateSchool(payload.id, payload.name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });

  // ✅ Delete school mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSchool(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });

  const handleSave = (name: string) => {
    if (editingSchool) updateMutation.mutate({ id: editingSchool.id, name });
    else createMutation.mutate(name);

    setIsOpen(false);
  };

  if (isLoading) return <p>Loading schools...</p>;
  if (isError) return <p>Failed to load schools</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Schools</h1>

      <Button
        onClick={() => {
          setEditingSchool(null);
          setIsOpen(true);
        }}
      >
        Add School
      </Button>

      <ul className="mt-4">
        {schools?.map((school: any) => (
          <li
            key={school.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>{school.name}</span>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingSchool(school);
                  setIsOpen(true);
                }}
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => deleteMutation.mutate(school.id)}
                size="sm"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {isOpen && (
        <SchoolModal
          school={editingSchool}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
