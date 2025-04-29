
import { User, FormResponse } from "../types/form";

const API_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export const createUser = async (user: User): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user");
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
    throw new Error("Unknown error occurred");
  }
};

export const getForm = async (rollNumber: string): Promise<FormResponse> => {
  try {
    const response = await fetch(`${API_URL}/get-form?rollNumber=${rollNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch form");
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching form: ${error.message}`);
    }
    throw new Error("Unknown error occurred");
  }
};
