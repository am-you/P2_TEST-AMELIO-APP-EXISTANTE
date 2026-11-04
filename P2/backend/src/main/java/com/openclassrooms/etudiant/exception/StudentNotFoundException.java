package com.openclassrooms.etudiant.exception;

// Am.Yo : id d'étudiant introuvable
public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(Long id) {
        super("Student not found: " + id);
    }
}
