package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.exception.StudentNotFoundException;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    private StudentService studentService;

    @BeforeEach
    void setUp() {
        StudentDtoMapper mapper = Mappers.getMapper(StudentDtoMapper.class);
        studentService = new StudentService(studentRepository, mapper);
    }

    // Am.Yo : crée un étudiant si l'email est libre
    @Test
    void create_saves_student_when_email_is_free() {
        when(studentRepository.findByEmail("lea.martin@test.fr")).thenReturn(Optional.empty());
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> {
            Student student = invocation.getArgument(0);
            student.setId(3L);
            return student;
        });

        StudentResponseDTO created = studentService.create(request("Lea", "Martin", "lea.martin@test.fr"));

        assertThat(created.getId()).isEqualTo(3L);
        assertThat(created.getFirstName()).isEqualTo("Lea");
        assertThat(created.getEmail()).isEqualTo("lea.martin@test.fr");
    }

    // Am.Yo : refuse un email déjà utilisé
    @Test
    void create_rejects_duplicate_email() {
        when(studentRepository.findByEmail("lea.martin@test.fr")).thenReturn(Optional.of(student(1L, "lea.martin@test.fr")));

        assertThrows(IllegalArgumentException.class,
                () -> studentService.create(request("Lea", "Martin", "lea.martin@test.fr")));
    }

    // Am.Yo : liste tous les étudiants
    @Test
    void findAll_returns_every_student() {
        when(studentRepository.findAll()).thenReturn(List.of(student(1L, "lea.martin@test.fr")));

        List<StudentResponseDTO> students = studentService.findAll();

        assertThat(students).hasSize(1);
        assertThat(students.get(0).getLastName()).isEqualTo("Martin");
    }

    // Am.Yo : détail, ou 404 si l'id n'existe pas
    @Test
    void findById_returns_student_or_throws_when_missing() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student(1L, "lea.martin@test.fr")));
        when(studentRepository.findById(9L)).thenReturn(Optional.empty());

        assertThat(studentService.findById(1L).getEmail()).isEqualTo("lea.martin@test.fr");
        assertThrows(StudentNotFoundException.class, () -> studentService.findById(9L));
    }

    // Am.Yo : remplace nom, prénom et email
    @Test
    void update_changes_fields_when_email_stays_free() {
        Student existing = student(1L, "lea.martin@test.fr");
        when(studentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(studentRepository.findByEmail("lea.bernard@test.fr")).thenReturn(Optional.empty());
        when(studentRepository.save(existing)).thenReturn(existing);

        StudentResponseDTO updated = studentService.update(1L, request("Lea", "Bernard", "lea.bernard@test.fr"));

        assertThat(updated.getLastName()).isEqualTo("Bernard");
        assertThat(updated.getEmail()).isEqualTo("lea.bernard@test.fr");
    }

    // Am.Yo : garde son email, refuse celui d'un autre, 404 si inconnu
    @Test
    void update_keeps_own_email_and_rejects_taken_or_missing() {
        Student existing = student(1L, "lea.martin@test.fr");
        when(studentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(studentRepository.findByEmail("lea.martin@test.fr")).thenReturn(Optional.of(existing));
        when(studentRepository.save(existing)).thenReturn(existing);

        StudentResponseDTO sameEmail = studentService.update(1L, request("Lea", "Martin", "lea.martin@test.fr"));
        assertThat(sameEmail.getId()).isEqualTo(1L);

        when(studentRepository.findByEmail("other@test.fr")).thenReturn(Optional.of(student(2L, "other@test.fr")));
        assertThrows(IllegalArgumentException.class,
                () -> studentService.update(1L, request("Lea", "Martin", "other@test.fr")));

        when(studentRepository.findById(9L)).thenReturn(Optional.empty());
        assertThrows(StudentNotFoundException.class,
                () -> studentService.update(9L, request("Lea", "Martin", "lea.martin@test.fr")));
    }

    // Am.Yo : supprime l'étudiant, ou 404
    @Test
    void delete_removes_student_or_throws_when_missing() {
        Student existing = student(1L, "lea.martin@test.fr");
        when(studentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(studentRepository.findById(9L)).thenReturn(Optional.empty());

        studentService.delete(1L);
        verify(studentRepository).delete(existing);
        assertThrows(StudentNotFoundException.class, () -> studentService.delete(9L));
    }

    private StudentRequestDTO request(String firstName, String lastName, String email) {
        StudentRequestDTO request = new StudentRequestDTO();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        return request;
    }

    private Student student(Long id, String email) {
        Student student = new Student();
        student.setId(id);
        student.setFirstName("Lea");
        student.setLastName("Martin");
        student.setEmail(email);
        return student;
    }
}
