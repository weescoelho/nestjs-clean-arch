export type FieldsError = { [field: string]: string[] }

export interface ValidatorFieldsInterface<T> {
  errors: FieldsError
  validatedData: T
  validate(data: any): boolean
}
