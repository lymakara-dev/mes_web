import api from "@/service/api";

export function DocumentApi() {
  return {
    getDocuments: async () => {
      const res = await api.get("/documents");
      return res.data;
    },
  };
}
