import Product from "../models/productmodel.js";
import UploadOnCloudinary from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price & category are required" });
    }

    // Upload image if provided
    let imageUrl = "";
    if (req.file) {
      const uploadResult = await UploadOnCloudinary(req.file.path);

      if (!uploadResult) {
        return res.status(500).json({ message: "Image upload failed" });
      }

      imageUrl = uploadResult.secure_url;
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image: imageUrl,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const { category, sort = "latest", page = 1, limit = 9 } = req.query;

    const filter = {};
    if (category) {
      filter.category = category; // exact match
    }

    // Sorting
    const sortOption =
      sort === "latest"
        ? { createdAt: -1 }
        : { createdAt: 1 };

    // Pagination numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Fetch products with filters, sorting & pagination
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total count for pagination UI
    const totalCount = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Products fetched successfully",
      totalCount,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



export const getProductById=async(req,res)=>{
    try{
const{id}=req.params;
const product=await Product.findById(id);
if(!product){
    return res.status(404).json({message:"Product not found"});
}
res.status(200).json({
    message:"Product fetched successfully",
    product
})
    }
    catch(error){
        res.status(500).json({ message: "Server error" ,error:error.message});
    }
}
export const deleteProductById=async(req,res)=>{
    try {
        const {id}=req.params;
        const product=await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        // await product.save();
        res.status(200).json({
            message:"Product deleted successfully",
            product
        })
    } catch (error) {
     res.status(500).json({ message: "Server error" ,error:error.message});   
    }
}
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find existing product
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update basic fields
        const { name, price, category, description } = req.body;
        if (name) product.name = name;
        if (price) product.price = price;
        if (category) product.category = category;
        if (description) product.description = description;

        // If new image is uploaded
        if (req.file) {
            const cloudinaryResponse = await UploadOnCloudinary(req.file.path);

            if (!cloudinaryResponse) {
                return res.status(500).json({ message: "Image upload failed" });
            }

            // Replace old image URL
            product.image = cloudinaryResponse.secure_url;
        }

        // Save updated product
        await product.save();

        return res.status(200).json({
            message: "Product updated successfully",
            product,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};