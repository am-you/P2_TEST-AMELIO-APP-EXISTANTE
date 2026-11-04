package com.openclassrooms.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.etudiant.dto.LoginRequestDTO;
import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class StudentControllerTest {

    @Container
    static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0");

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;

    @DynamicPropertySource
    static void configureTestProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
        // Am.Yo : JWT de test, indépendant du .env
        registry.add("jwt.secret", () -> "test-jwt-secret-key-at-least-32b");
        registry.add("jwt.expiration", () -> "3600000");
    }

    @AfterEach
    void cleanDatabase() {
        studentRepository.deleteAll();
        userRepository.deleteAll();
    }

    // Am.Yo : login renvoie un JWT, mauvais mot de passe ou corps vide sont refusés
    @Test
    void login_returns_text_token_or_400() throws Exception {
        register("am.test1");

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login("am.test1", "password"))))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andExpect(content().string(startsWith("eyJ")));

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login("am.test1", "wrong"))))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    // Am.Yo : CRUD étudiant seulement avec un JWT
    @Test
    void student_crud_requires_jwt_and_covers_create_read_update_delete() throws Exception {
        register("am.test1");
        String token = loginToken("am.test1");

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/students").header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/students")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());

        MvcResult created = mockMvc.perform(post("/api/students")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(studentJson("Lea", "Martin", "lea.martin@test.fr")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("lea.martin@test.fr"))
                .andReturn();
        long id = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(post("/api/students")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(studentJson("Lea", "Martin", "lea.martin@test.fr")))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("already exists")));

        mockMvc.perform(get("/api/students").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mockMvc.perform(get("/api/students/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Lea"));

        mockMvc.perform(get("/api/students/999").header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound())
                .andExpect(content().string(containsString("Student not found")));

        mockMvc.perform(put("/api/students/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(studentJson("Lea", "Bernard", "lea.bernard@test.fr")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Bernard"));

        mockMvc.perform(delete("/api/students/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/students/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/students/999").header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    private void register(String login) throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setFirstName("Am");
        registerDTO.setLastName("Test");
        registerDTO.setLogin(login);
        registerDTO.setPassword("password");
        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isCreated());
    }

    private String loginToken(String login) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(this.login(login, "password"))))
                .andExpect(status().isOk())
                .andReturn();
        return result.getResponse().getContentAsString();
    }

    private LoginRequestDTO login(String login, String password) {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setLogin(login);
        loginRequestDTO.setPassword(password);
        return loginRequestDTO;
    }

    private String studentJson(String firstName, String lastName, String email) throws Exception {
        StudentRequestDTO request = new StudentRequestDTO();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        return objectMapper.writeValueAsString(request);
    }
}
