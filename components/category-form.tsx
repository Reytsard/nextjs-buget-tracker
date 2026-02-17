"use client";
import React, { useEffect, useState } from "react";
import { Field, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { SelectItem } from "./ui/select";
import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { Input } from "./ui/input";

function CategoryForm() {
  const [categories, setCategories] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    //fetch categories from database
    const supabase = createClient();
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("Category").select("*");
      if (!error) {
        console.log(data);
        // setCategories(data);
      } else {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [categories]);

  const handleAddNewCategory = (e: any) => {
    e.preventDefault();
    setIsAdding(true);
  };

  return (
    <Field>
      <FieldLabel htmlFor="Category">
        Category{" "}
        <Button size={"sm"} onClick={handleAddNewCategory}>
          {" "}
          Add Category
        </Button>
      </FieldLabel>
      {!isAdding ? (
        <Select name="Category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {/* //values in select content, get it from database */}
            {/* {categories.data &&
            categories.data.map((type: any) => (
              <SelectItem key={type.value} value={type.value}>
                {type.value}
              </SelectItem>
            ))} */}
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
