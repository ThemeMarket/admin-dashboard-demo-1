import { FormGroup } from '@angular/forms';

export function hasErrorForm(
  form: FormGroup,
  fieldName: string,
  errorType: string
): boolean {
  const field = form.get(fieldName);

  if (!field) {
    throw new Error(`Field with the name ${fieldName} doesn't exists`);
  }

  return field.hasError(errorType) && field.touched;
}
