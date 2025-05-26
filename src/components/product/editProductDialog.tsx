import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Avatar } from "@mui/material";
import type { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { editProduct } from "../../redux/slice/productSlice";
import type { AppDispatch } from "../../redux/store/store";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrls?: string[];
  stock: number;
  createdAt: string;
}

interface EditProductDialogProps {
  open: boolean;
  selectedProductId: string;
  editedProduct: Partial<Product>;
  selectedImages: File[];
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({ open, selectedProductId, editedProduct, selectedImages, onClose, onInputChange, onImageChange }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
  if (!selectedProductId) {
    console.error("No selected product ID.");
    return;
  }

  const formData = new FormData();
  formData.append("name", editedProduct.name ?? "");
  formData.append("description", editedProduct.description ?? "");
  formData.append("price", editedProduct.price?.toString() ?? "");
  formData.append("stock", editedProduct.stock?.toString() ?? "");
  selectedImages.forEach((file) => {
    formData.append("images", file);
  });

  await dispatch(editProduct({ id: selectedProductId, formData }));
  onClose();
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={editedProduct.name ?? ""}
          onChange={onInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={editedProduct.description ?? ""}
          onChange={onInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Price"
          name="price"
          type="number"
          value={editedProduct.price ?? ""}
          onChange={onInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Stock"
          name="stock"
          type="number"
          value={editedProduct.stock ?? ""}
          onChange={onInputChange}
        />
        <Button component="label" variant="outlined" fullWidth sx={{ mt: 2 }}>
          Upload New Images
          {/* SonarLint false positive: input inside label is intentional */}
          <input type="file" hidden multiple onChange={onImageChange} />
        </Button>
        <Grid container spacing={1} mt={1}>
          {selectedImages.map((file) => (
            <Grid
              item
              xs={12}
              key={file.name || file.lastModified}
              component={"div" as React.ElementType}
            >
              <Avatar
                src={URL.createObjectURL(file)}
                variant="rounded"
                sx={{ width: 56, height: 56 }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
