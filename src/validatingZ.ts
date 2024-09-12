import { z } from "zod";

export const userSchema = z.object({

    name: z.string().min(3, "Name is required").max(25, "Name is too long"),

    email: z.string().email("Invalid email format"),

    favoritebook: z.string().min(5, "Favorite book is required").
    max(30, "Favorite book is too long (min: 5 characters, max: 30 characters)"),

    favoritegenre: z.string().min(3, "Favorite genre is required").max(20, "Favorite genre is too long (min: 3 characters, max: 20 characters)"),
    
});

export const bookSchema = z.object({

    title: z.string().min(4, "Title is required").max(30, "Title is too long (min: 4 characters, max: 30 characters)"),

    author: z.string().min(4, "Author is required").max(25, "Author is too long (min: 4 characters, max: 25 characters)"),

    description: z.string().min(10, "Description is required").max(100, "Description is too long (min: 10 characters, max: 100 characters)"),

    year: z.number().min(1, "Year is required"),

});