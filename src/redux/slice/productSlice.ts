import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  filterProducts,
  createProduct,
} from "../../apis/productApi";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrls?: string[];
  stock: number;
  createdAt: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async () => {
    const res = await getProducts();
    return res.data;
  }
);

export const fetchFilteredProducts = createAsyncThunk(
  "products/fetchFiltered",
  async (params: Record<string, string>) => {
    const res = await filterProducts(params);
    return res.data;
  }
);

export const removeProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    await deleteProduct(id);
    return id;
  }
);

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, formData }: { id: string; formData: FormData }) => {
    const res = await updateProduct(id, formData);
    return res.data; 
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (formData: FormData) => {
    const res = await createProduct(formData);
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Fetch failed";
      })

      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })

      .addCase(editProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        state.products = state.products.map((product) =>
          product._id === updated._id ? updated : product
        );
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      });
  },
});

export default productSlice.reducer;
