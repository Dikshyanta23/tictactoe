// PlayerForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "./ThemeContext";

interface PlayerFormInputs {
  playerName: string;
  age: number;
  email: string;
  startFirst: boolean;
}

interface PlayerFormProps {
  onSubmit: SubmitHandler<PlayerFormInputs>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const validationSchema = yup.object().shape({
  playerName: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  age: yup
    .number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  startFirst: yup.boolean().required(),
});

const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmit, setShowForm }) => {
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerFormInputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      playerName: "",
      age: undefined,
      email: "",
      startFirst: false,
    },
  });

  const styles = {
    container: {
      backgroundColor: theme === "dark" ? "#2d3748" : "#e5e7eb",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "28rem",
      margin: "16px auto",
    },
    form: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "8px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
      width: "100%",
    },
    label: {
      fontSize: "1rem",
      fontWeight: "600",
      color: theme === "dark" ? "#ffff" : "#000000",
    },
    input: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid",
      borderColor: theme === "dark" ? "#4a5568" : "#d1d5db",
      backgroundColor: theme === "dark" ? "#4a5568" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
      width: "100%",
    },
    errorMessage: {
      color: theme === "dark" ? "#f87171" : "#dc2626",
      fontSize: "0.875rem",
      marginTop: "2px",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: "100%",
      justifyContent: "center",
    },
    checkbox: {
      width: "16px",
      height: "16px",
    },
    checkboxLabel: {
      fontSize: "1rem",
      fontWeight: "600",
      color: theme === "dark" ? "#ffff" : "#000000",
    },
    submitButton: {
      padding: "8px 24px",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      width: "100%",
      transition: "background-color 0.3s ease",
    },
    cancelButton: {
      padding: "8px 24px",
      backgroundColor: "#6b7280",
      color: "#ffffff",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      width: "100%",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="playerName" style={styles.label}>
            Name:
          </label>
          <input
            id="playerName"
            type="text"
            {...register("playerName")}
            style={styles.input}
            placeholder="Enter your name"
          />
          {errors.playerName && (
            <span style={styles.errorMessage}>{errors.playerName.message}</span>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="age" style={styles.label}>
            Age:
          </label>
          <input
            id="age"
            type="number"
            {...register("age")}
            style={styles.input}
            placeholder="Enter your age"
          />
          {errors.age && (
            <span style={styles.errorMessage}>{errors.age.message}</span>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            style={styles.input}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span style={styles.errorMessage}>{errors.email.message}</span>
          )}
        </div>

        <div style={styles.checkboxContainer}>
          <input
            id="startFirst"
            type="checkbox"
            {...register("startFirst")}
            style={styles.checkbox}
            defaultChecked={true}
          />
          <label htmlFor="startFirst" style={styles.checkboxLabel}>
            Go First?
          </label>
        </div>

        <button type="submit" style={styles.submitButton}>
          Start Game
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          style={styles.cancelButton}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PlayerForm;
