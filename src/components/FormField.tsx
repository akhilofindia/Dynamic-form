
import { useState } from "react";
import { FormField } from "../types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FieldProps {
  field: FormField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
}

const DynamicField = ({ field, value, onChange, error }: FieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field.fieldId, e.target.value);
  };

  const handleSelectChange = (val: string) => {
    onChange(field.fieldId, val);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(field.fieldId, checked);
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <Input
            type={field.type}
            id={field.fieldId}
            data-testid={field.dataTestId}
            placeholder={field.placeholder || ""}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            value={value || ""}
            onChange={handleChange}
            className={error ? "border-red-500" : ""}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={field.fieldId}
            data-testid={field.dataTestId}
            placeholder={field.placeholder || ""}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            value={value || ""}
            onChange={handleChange}
            className={error ? "border-red-500" : ""}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            id={field.fieldId}
            data-testid={field.dataTestId}
            required={field.required}
            value={value || ""}
            onChange={handleChange}
            className={error ? "border-red-500" : ""}
          />
        );

      case "dropdown":
        return (
          <Select value={value || ""} onValueChange={handleSelectChange}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={(value) => onChange(field.fieldId, value)}
            className="flex flex-col space-y-1"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${field.fieldId}-${option.value}`}
                  data-testid={option.dataTestId}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.fieldId}
              data-testid={field.dataTestId}
              checked={!!value}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor={field.fieldId}>{field.placeholder || ""}</Label>
          </div>
        );

      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="mb-4">
      <Label 
        htmlFor={field.fieldId}
        className={`mb-2 block ${field.required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""}`}
      >
        {field.label}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default DynamicField;
