// controllers/category.controller.js
import mongoose from "mongoose";
import Category from "../models/categorymodel.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, slug });

    res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    console.error("Error in createCategory:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ categories });
  } catch (err) {
    console.error("Error in getCategories:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (err) {
    console.error("Error in getCategoryById:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (err) {
    console.error("Error in updateCategory:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error in deleteCategory:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};