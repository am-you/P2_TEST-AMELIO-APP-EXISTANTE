package com.openclassrooms.etudiant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    // Am.Yo : login et mot de passe obligatoires
    @NotBlank
    private String login;
    @NotBlank
    private String password;

}
