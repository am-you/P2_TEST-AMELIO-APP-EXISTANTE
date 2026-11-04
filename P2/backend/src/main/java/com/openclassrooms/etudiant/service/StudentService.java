package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.exception.StudentNotFoundException;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.repository.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final StudentDtoMapper studentDtoMapper;

    // Am.Yo : crée un étudiant si l'email est libre
    public StudentResponseDTO create(StudentRequestDTO request) {
        studentRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            throw new IllegalArgumentException("Student with email " + request.getEmail() + " already exists");
        });
        Student saved = studentRepository.save(studentDtoMapper.toEntity(request));
        return studentDtoMapper.toDto(saved);
    }

    // Am.Yo : liste tous les étudiants
    public List<StudentResponseDTO> findAll() {
        return studentRepository.findAll().stream()
                .map(studentDtoMapper::toDto)
                .toList();
    }

    // Am.Yo : détail d'un étudiant, 404 s'il n'existe pas
    public StudentResponseDTO findById(Long id) {
        return studentDtoMapper.toDto(getStudent(id));
    }

    // Am.Yo : remplace nom, prénom et email
    public StudentResponseDTO update(Long id, StudentRequestDTO request) {
        Student student = getStudent(id);
        studentRepository.findByEmail(request.getEmail())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Student with email " + request.getEmail() + " already exists");
                });
        studentDtoMapper.updateEntity(request, student);
        return studentDtoMapper.toDto(studentRepository.save(student));
    }

    // Am.Yo : supprime l'étudiant
    public void delete(Long id) {
        studentRepository.delete(getStudent(id));
    }

    private Student getStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }
}
