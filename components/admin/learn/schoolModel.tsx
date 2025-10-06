// components/admin/SchoolModal.tsx
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

export default function SchoolModal({ school, onClose, onSave }: any) {
  const [name, setName] = useState(school?.name || "");

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{school ? "Edit School" : "Add School"}</h2>
        <Input defaultValue={name} onChange={(e) => setName(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(name)}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
