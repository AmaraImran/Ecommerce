import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.product);
        setPreview(res.data.product.image);
      } catch (err) {
        console.log("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return <p className="text-center text-white mt-10">Loading...</p>;

  // handle file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewImage(file);
    setPreview(URL.createObjectURL(file)); // instant preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageURL = product.image;

      // If user selected a new image → upload it
      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);

        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageURL = uploadRes.data.imageUrl;
      }

      // Update the product
      await api.put(`/product/${id}`, {
        ...product,
        image: imageURL,
      });

      alert("Product updated successfully!");
      navigate("/admin/products");

    } catch (err) {
      console.log("Update error:", err);
    }
  };

  return (
    <div className="p-6 flex justify-center bg-black min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* Product Name */}
          <div>
            <label className="block text-gray-700 mb-1">Product Name</label>
            <input
              className="w-full border rounded-lg p-3 bg-gray-50 text-black"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 mb-1">Price</label>
            <input
              type="number"
              className="w-full border rounded-lg p-3 bg-gray-50 text-black"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              className="w-full border rounded-lg p-3 bg-gray-50 text-black"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 mb-1">Category</label>
            <select
              className="w-full border rounded-lg p-3 bg-gray-50 text-black"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            >
              <option value="tech">Tech</option>
              <option value="electronics">Electronics</option>
              <option value="clothes">Clothes</option>
            </select>
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-gray-700"
            />
          </div>

          {/* Preview */}
          <div className="flex justify-center items-center">
            <img
              src={preview}
              className="w-28 h-28 rounded-lg border shadow object-cover"
            />
          </div>

          {/* Description full row */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-1 ">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full border rounded-lg p-3 bg-gray-50 text-black"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          {/* Submit button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
