import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
const token = localStorage.getItem("token");
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

  // handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // append fields
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category", product.category);
    formData.append("description", product.description);

    // append image if user selected a new one
    if (newImage) {
      formData.append("image", newImage);
    }

    await api.patch(`/product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
    });

    alert("Product updated successfully!");
    navigate("/admin/products");

  } catch (err) {
    console.log("Update error:", err);
  }
};


  return (
    <div className="p-6 flex justify-center bg-black min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8">

        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Edit Product
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Product Name
            </label>
            <input
              className="w-full border rounded-lg p-3 bg-gray-100 text-black focus:ring focus:ring-blue-300"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Price
            </label>
            <input
              type="number"
              className="w-full border rounded-lg p-3 bg-gray-100 text-black focus:ring focus:ring-blue-300"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Stock
            </label>
            <input
              type="number"
              className="w-full border rounded-lg p-3 bg-gray-100 text-black focus:ring focus:ring-blue-300"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value })
              }
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Category
            </label>
            <select
              className="w-full border rounded-lg p-3 bg-gray-100 text-black focus:ring focus:ring-blue-300"
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

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Change Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-lg p-2 bg-gray-100 text-black cursor-pointer"
            />
          </div>

          {/* IMAGE PREVIEW */}
          <div className="flex justify-center items-center">
            <img
              src={preview}
              alt="preview"
              className="w-28 h-28 rounded-lg border shadow-md object-cover"
            />
          </div>

          {/* DESCRIPTION (FULL WIDTH) */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full border rounded-lg p-3 bg-gray-100 text-black focus:ring focus:ring-blue-300"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
