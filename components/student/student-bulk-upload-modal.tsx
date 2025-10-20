'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/service/api';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, addToast } from '@heroui/react';
import { Upload, Download } from 'lucide-react';

interface StudentBulkUploadModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  parentQueryKey: (string | number | undefined)[];
}

export const StudentBulkUploadModal = ({ isOpen, onOpenChange, parentQueryKey }: StudentBulkUploadModalProps) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const { mutate: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: (formData: FormData) => apiService.postMultipart('/students/upload', formData),
    onSuccess: () => {
      addToast({ title: "Upload Successful", description: "Students are being processed.", color: "success" });
      queryClient.invalidateQueries({ queryKey: parentQueryKey });
      onOpenChange();
    },
    onError: (error: any) => addToast({ title: "Upload Error", description: error.response?.data?.message || 'Failed to upload file.', color: "danger" }),
  });

  const handleBulkUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    uploadFile(formData);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Bulk Upload Students</ModalHeader>
            <ModalBody>
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-500">
                  Upload a CSV file with columns: <strong>name, email, password</strong>.
                </p>
                {/* Add a download template link if you have one */}
                {/* <a href={`${process.env.NEXT_PUBLIC_MES_API_BASE_URL}/students/download/template`}>
                  <Button color="secondary" variant="faded" startContent={<Download size={16} />}>
                    Download Template
                  </Button>
                </a> */}
                <hr className="dark:border-gray-700 my-4" />
                <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>Cancel</Button>
              <Button color="secondary" onPress={handleBulkUpload} isLoading={isUploading} startContent={<Upload size={16}/>} isDisabled={!file}>
                Upload File
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};