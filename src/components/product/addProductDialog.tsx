import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Avatar } from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/slice/productSlice";
import type { AppDispatch } from "../../redux/store/store";

interface AddProductDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (formData: FormData) => void;
}

export default function AddProductDialog({ open, onClose, onSubmit }: AddProductDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState({ name: "", description: "", price: "", stock: "" });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("createdAt", new Date().toISOString());

      images.forEach((file) => {
        formData.append("images", file);
      });

      await dispatch(addProduct(formData));
      onSubmit(formData);
      setProduct({ name: "", description: "", price: "", stock: "" });
      setImages([]);
    } catch (err) {
      console.error("Add product failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Stock"
          name="stock"
          type="number"
          value={product.stock}
          onChange={handleChange}
        />
        <Button component="label" variant="outlined" fullWidth sx={{ mt: 2 }}>
          Upload Images
          {/* SonarLint false positive: input inside label is intentional */}
          <input type="file" hidden multiple onChange={handleImageChange} />
        </Button>

        <Grid container spacing={1} mt={1}>
          {images.map((file) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <Grid
                item
                xs={2}
                key={previewUrl}
                component={"div" as React.ElementType}
              >
                <Avatar
                  src={previewUrl}
                  variant="rounded"
                  sx={{ width: 56, height: 56 }}
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
