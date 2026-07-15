import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Інтерфейс для пропсів компонента
interface NoteFormProps {
  onCancel: () => void;
}

// 2. Інтерфейс для значень форми (сувора типізація Formik)
interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

// 3. Yup-схема валідації
const NoteValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Заголовок має бути не менше 3 символів")
    .required("Заголовок є обов’язковим"),
  content: Yup.string()
    .min(10, "Текст має бути не менше 10 символів")
    .required("Текст нотатки є обов’язковим"),
  tag: Yup.string().required("Будь ласка, оберіть тег"),
});

// Імітація API-функції для створення нотатки (замініть на ваш реальний axios/fetch запит)
const createNoteApi = async (newNote: NoteFormValues): Promise<void> => {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newNote),
  });
  if (!response.ok) throw new Error("Помилка при створенні нотатки");
};

export const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  // 4. Mutation з TanStack Query для створення нотатки
  const { mutate, isPending } = useMutation({
    mutationFn: createNoteApi,
    onSuccess: () => {
      // Інвалідація запиту нотаток для оновлення списку
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // Закриття форми після успішної відправки
      onCancel();
    },
    onError: (error: Error) => {
      alert(`Не вдалося зберегти: ${error.message}`);
    },
  });

  // Початкові значення форми
  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "",
  };

  // Обробник відправки форми
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
          <h3>Створити нотатку</h3>

          {/* Поле Title */}
          <div className="form-group">
            <label htmlFor="title">Заголовок</label>
            <Field
              id="title"
              name="title"
              type="text"
              placeholder="Введіть заголовок"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="error-message"
            />
          </div>

          {/* Поле Content */}
          <div className="form-group">
            <label htmlFor="content">Текст нотатки</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              placeholder="Введіть текст нотатки"
            />
            <ErrorMessage
              name="content"
              component="div"
              className="error-message"
            />
          </div>

          {/* Випадаючий список для Tag */}
          <div className="form-group">
            <label htmlFor="tag">Тег</label>
            <Field id="tag" name="tag" as="select">
              <option value="" disabled>
                Оберіть тег
              </option>
              <option value="work">Робота</option>
              <option value="personal">Особисте</option>
              <option value="ideas">Ідеї</option>
            </Field>
            <ErrorMessage
              name="tag"
              component="div"
              className="error-message"
            />
          </div>

          {/* Кнопки дій */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || isPending}
            >
              Скасувати
            </button>
            <button type="submit" disabled={isSubmitting || isPending}>
              {isPending ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
