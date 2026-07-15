import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Масив дозволених тегів для валідації та рендерингу
const ALLOWED_TAGS = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;
type AllowedTag = (typeof ALLOWED_TAGS)[number];

// 2. Інтерфейси для пропсів та значень форми
interface NoteFormProps {
  onCancel: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: AllowedTag | "";
}

// 3. Виправлена Yup-схема валідації (англійською мовою)
const NoteValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content cannot exceed 500 characters")
    .notRequired(), // Поле є необов'язковим
  tag: Yup.string()
    .oneOf([...ALLOWED_TAGS], "Invalid tag selection") // Обмеження лише дозволеними тегами
    .required("Tag is required"),
});

// Імітація API-функції (замініть на ваш реальний запит)
const createNoteApi = async (newNote: NoteFormValues): Promise<void> => {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newNote),
  });
  if (!response.ok) throw new Error("Failed to create note");
};

export const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
    onError: (error: Error) => {
      alert(`Error saving note: ${error.message}`);
    },
  });

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "",
  };

  const handleSubmit = (
    values: NoteFormValues,
    { setSubmitting }: FormikHelpers<NoteFormValues>,
  ): void => {
    mutate(values, {
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="note-form">
          <h3>Create Note</h3>

          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              placeholder="Enter title"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="error-message"
            />
          </div>

          {/* Content Field */}
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              placeholder="Enter content (optional)"
            />
            <ErrorMessage
              name="content"
              component="div"
              className="error-message"
            />
          </div>

          {/* Tag Field (з правильним регістром та опціями) */}
          <div className="form-group">
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select">
              <option value="" disabled>
                Select a tag
              </option>
              {ALLOWED_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="tag"
              component="div"
              className="error-message"
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || isPending}
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
