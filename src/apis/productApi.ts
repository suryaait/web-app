import api from "./api";

export const getProducts = () => api.get("");
export const getProduct = (id: string) => api.get(`/${id}`);
export const deleteProduct = (id: string) => api.delete(`/${id}`);

export const updateProduct = (id: string, data: FormData) =>
  api.post(`/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const createProduct = (data: FormData) =>
  api.post("/upload-multiple", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  export const filterProducts = (params: Record<string, string>) =>
  api.get("/filter", { params });