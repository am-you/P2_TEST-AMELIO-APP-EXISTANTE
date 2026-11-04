package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.User;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class JwtServiceTest {

    private static final String SECRET = "test-jwt-secret-key-at-least-32b";

    // Am.Yo : signe un JWT et relit le login
    @Test
    void generateToken_contains_the_login_and_stays_valid() {
        JwtService jwtService = new JwtService(SECRET, 60_000);
        User user = user("am.test1");

        String token = jwtService.generateToken(user);

        assertThat(jwtService.extractUsername(token)).isEqualTo("am.test1");
        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }

    // Am.Yo : refuse un token expiré, d'un autre login, ou mal signé
    @Test
    void isTokenValid_rejects_expired_other_user_or_bad_signature() {
        User user = user("am.test1");
        JwtService expiredService = new JwtService(SECRET, -1_000);
        String expired = expiredService.generateToken(user);
        assertThrows(JwtException.class, () -> expiredService.isTokenValid(expired, user));

        JwtService jwtService = new JwtService(SECRET, 60_000);
        String token = jwtService.generateToken(user);
        assertThat(jwtService.isTokenValid(token, user("am.test2"))).isFalse();

        JwtService otherKey = new JwtService("another-jwt-secret-key-32-bytes!!", 60_000);
        assertThrows(JwtException.class, () -> jwtService.extractUsername(otherKey.generateToken(user)));
    }

    private User user(String login) {
        User user = new User();
        user.setLogin(login);
        user.setPassword("password");
        return user;
    }
}
