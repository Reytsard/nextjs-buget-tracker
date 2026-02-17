"use client";
import React, { useEffect, useState } from "react";
import { Field, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Category } from "@/app/types/Types";

function CategoryForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    //fetch categories from database
    const supabase = createClient();
    const fetchCategories = async () => {
      const { data: categories, error } = await supabase
        .from("Category")
        .select("*");
      if (!error) {
        console.log(categories);
        setCategories(categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleAddNewCategory = (e: any) => {
    e.preventDefault();
    setIsAdding((prev) => !prev);
  };

  return (
    <Field>
      <FieldLabel htmlFor="Category">
        Category{" "}
        <Button size={"sm"} onClick={handleAddNewCategory}>
          {" "}
          {isAdding ? "Cancel" : "Add Category"}
        </Button>
      </FieldLabel>
      {!isAdding ? (
        <Select name="Category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {/* //values in select content, get it from database */}
            {categories &&
              categories.map((type: Category) => (
                <SelectItem key={type.id} value={type.category}>
                  {type.category}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      ) : (
        <Field>
          <FieldLabel htmlFor="newCategory">New Category</FieldLabel>
          <Input
            id="newCategory"
            name="newCategory"
            type="text"
            placeholder="New Category"
          />
        </Field>
      )}
    </Field>
  );
}

export default CategoryForm;
