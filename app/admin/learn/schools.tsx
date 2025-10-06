import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { useAdminApi } from "@/hooks/useAdminApi";
import SchoolModal from "@/components/admin/learn/schoolModel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminSchools() {
  const api = useAdminApi();
  const queryClient = useQueryClient();

  // Fetch schools
  const {
    data: schools,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: api.getSchools,
  });

  // Mutations
  const createSchool = useMutation({
    mutationFn: (name: string) => api.createSchool(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });

  const updateSchool = useMutation({
    mutationFn: (payload: { id: number; name: string }) =>
      api.updateSchool(payload.id, payload.name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });

  const deleteSchool = useMutation({
    mutationFn: (id: number) => api.deleteSchool(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schools"] }),
  });

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);

  if (isLoading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading schools...</p>
    );
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">Failed to load schools.</p>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
            🏫 School Management
          </h1>
          <Button
            onClick={() => {
              setEditingSchool(null);
              setIsOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Add School
          </Button>
        </div>

        {/* School List */}
        {schools?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No schools found.</p>
        ) : (
          <ul className="space-y-3">
            {schools?.map((school: any) => (
              <li
                key={school.id}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow transition"
              >
                <span className="font-medium text-lg">{school.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingSchool(school);
                      setIsOpen(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteSchool.mutate(school.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <SchoolModal
          school={editingSchool}
          onClose={() => setIsOpen(false)}
          onSave={(name: string) => {
            if (editingSchool)
              updateSchool.mutate({ id: editingSchool.id, name });
            else createSchool.mutate(name);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
