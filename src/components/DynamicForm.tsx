
import { useState, useEffect } from "react";
import { FormResponse, FormSection, FormData, User } from "../types/form";
import { getForm } from "../services/api";
import DynamicField from "./FormField";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface DynamicFormProps {
  user: User;
}

const DynamicForm = ({ user }: DynamicFormProps) => {
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const data = await getForm(user.rollNumber);
        setFormData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch form",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [user.rollNumber, toast]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear error when field is updated
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (section: FormSection): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const field of section.fields) {
      const value = formValues[field.fieldId];
      
      // Check required fields
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.fieldId] = field.validation?.message || "This field is required";
        isValid = false;
        continue;
      }

      // Skip further validation if field is empty and not required
      if (!value && !field.required) continue;

      // Validate minLength
      if (field.minLength !== undefined && 
          typeof value === "string" && 
          value.length < field.minLength) {
        newErrors[field.fieldId] = `Must be at least ${field.minLength} characters`;
        isValid = false;
      }

      // Validate maxLength
      if (field.maxLength !== undefined && 
          typeof value === "string" && 
          value.length > field.maxLength) {
        newErrors[field.fieldId] = `Cannot exceed ${field.maxLength} characters`;
        isValid = false;
      }

      // Add more validations as needed
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextSection = () => {
    if (!formData) return;
    
    const currentSectionData = formData.form.sections[currentSection];
    if (!validateSection(currentSectionData)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the current section before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentSection < formData.form.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData) return;
    
    const currentSectionData = formData.form.sections[currentSection];
    if (!validateSection(currentSectionData)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the current section before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Add user info to form data
    const finalFormData = {
      ...formValues,
      rollNumber: user.rollNumber,
      name: user.name,
    };

    console.log("Form Submitted Successfully:", finalFormData);
    toast({
      title: "Form Submitted",
      description: "Your form has been submitted successfully.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading form...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Failed to load form.</p>
      </div>
    );
  }

  const currentSectionData = formData.form.sections[currentSection];
  const isLastSection = currentSection === formData.form.sections.length - 1;
  const isFirstSection = currentSection === 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{formData.form.formTitle}</CardTitle>
        <CardDescription>
          Section {currentSection + 1} of {formData.form.sections.length}: {currentSectionData.title}
        </CardDescription>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentSection + 1) / formData.form.sections.length) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-500">{currentSectionData.description}</p>
        </div>
        
        <div className="space-y-4">
          {currentSectionData.fields.map((field) => (
            <DynamicField
              key={field.fieldId}
              field={field}
              value={formValues[field.fieldId]}
              onChange={handleFieldChange}
              error={errors[field.fieldId] || null}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevSection}
          disabled={isFirstSection}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        {isLastSection ? (
          <Button onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button onClick={handleNextSection}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DynamicForm;
