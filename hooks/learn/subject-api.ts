import api from "@/service/api";

export function SubjectApi() {
  return {
    getSubjectBySchool: async (schoolId: number) => {
      const res = await api.get(`subjects/school`, {
        params: { schoolId },
      });
      console.log("subject res", res.data);
      return res.data;
    },
  };
}
