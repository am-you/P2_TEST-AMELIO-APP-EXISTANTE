// Am.Yo : mêmes champs que les DTO étudiant du back
export interface StudentRequest {
  firstName: string,
  lastName: string,
  email: string
}

export interface Student {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  created_at: string,
  updated_at: string
}
