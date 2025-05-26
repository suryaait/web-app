import { useEffect, useState, type ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Button,
  Grid,
  TextField,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddProductDialog from "./addProductDialog";
import EditProductDialog from "./editProductDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchFilteredProducts,
  removeProduct,
  editProduct,
  addProduct,
} from "../../redux/slice/productSlice";
import type { AppDispatch, RootState } from "../../redux/store/store";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrls?: string[];
  createdAt?: string;
}

interface EditedProduct {
  name?: string;
  description?: string;
  price?: number;
}

export default function ProductTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.products);

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<EditedProduct>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch(removeProduct(productToDelete)).then(() => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      });
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditedProduct({ ...product });
    setSelectedImages([]);
    setOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleEditSubmit = () => {
    if (selectedProduct) {
      const formData = new FormData();
      formData.append("name", editedProduct.name ?? "");
      formData.append("description", editedProduct.description ?? "");
      formData.append("price", editedProduct.price?.toString() ?? "");
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });
      dispatch(editProduct({ id: selectedProduct._id, formData })).then(() => {
        setOpen(false);
      });
    }
  };

  const handleAddSubmit = (formData: FormData) => {
    dispatch(addProduct(formData)).then(() => {
      setAddOpen(false);
      dispatch(fetchAllProducts());
    });
  };

  const fetchProducts = () => {
    const params: Record<string, string> = {};
    if (filterName) params.name = filterName;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder.trim()) params.sortOrder = sortOrder;
    dispatch(fetchFilteredProducts(params));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)",
        py: 6,
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "95%",
          mx: "auto",
          p: 3,
          borderRadius: 3,
          boxShadow: 5,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" gutterBottom align="center" sx={{ mt: 1 }}>
          Product Table
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddOpen(true)}
          >
            Add Product
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ px: 2, pb: 3 }} alignItems="center">
          <Grid item xs={12} sm={4} component={"div" as React.ElementType}>
            <TextField
              label="Filter by Name"
              fullWidth
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4} component={"div" as React.ElementType}>
            <TextField
              select
              sx={{ width: "150px" }}
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="">
                <em>Select here</em>
              </MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
              <MenuItem value="createdAt">Created Date</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4} component={"div" as React.ElementType}>
            <TextField
              select
              label="Sort Order"
              sx={{ width: "150px" }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ textAlign: "right" }}
            component={"div" as React.ElementType}
          >
            <Button
              variant="contained"
              onClick={fetchProducts}
              sx={{ minWidth: 160 }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>

        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>
                <strong>Images</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Price (₹)</strong>
              </TableCell>
              <TableCell>
                <strong>Stock</strong>
              </TableCell>
              <TableCell>
                <strong>Created At</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product._id}
                sx={{
                  backgroundColor:
                    products.indexOf(product) % 2 === 0 ? "#fafafa" : "#ffffff",
                }}
              >
                <TableCell>
                  <Box component="div" sx={{ display: "flex", gap: 1 }}>
                    {(product.imageUrls ?? []).map((url: string) => (
                      <Avatar
                        key={url}
                        src={`http://localhost:3000${url}`}
                        variant="rounded"
                        sx={{ width: 56, height: 56 }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddProductDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddSubmit}
      />
      {selectedProduct && (
        <EditProductDialog
          open={open}
          editedProduct={editedProduct}
          selectedProductId={selectedProduct._id}
          selectedImages={selectedImages}
          onClose={() => setOpen(false)}
          onInputChange={handleEditChange}
          onImageChange={handleImageChange}
          onSubmit={handleEditSubmit}
        />
      )}
    </Box>
  );
}
