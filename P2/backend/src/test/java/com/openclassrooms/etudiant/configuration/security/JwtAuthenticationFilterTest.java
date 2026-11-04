package com.openclassrooms.etudiant.configuration.security;

import com.openclassrooms.etudiant.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;
    @Mock
    private UserDetailsService userDetailsService;
    @Mock
    private FilterChain filterChain;

    @AfterEach
    void clearSecurity() {
        SecurityContextHolder.clearContext();
    }

    // Am.Yo : sans Bearer, la requête continue sans utilisateur
    @Test
    void missing_bearer_does_not_authenticate() throws Exception {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Basic abc");

        filter.doFilter(request, new MockHttpServletResponse(), filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(any(), any());
    }

    // Am.Yo : un JWT valide connecte l'utilisateur
    @Test
    void valid_bearer_sets_authentication() throws Exception {
        UserDetails user = new User("am.test1", "password", List.of());
        when(jwtService.extractUsername("good-token")).thenReturn("am.test1");
        when(userDetailsService.loadUserByUsername("am.test1")).thenReturn(user);
        when(jwtService.isTokenValid("good-token", user)).thenReturn(true);
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer good-token");

        filter.doFilter(request, new MockHttpServletResponse(), filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("am.test1");
        verify(filterChain).doFilter(any(), any());
    }

    // Am.Yo : token invalide ou login inconnu, personne n'est connecté
    @Test
    void invalid_token_or_unknown_user_clears_authentication() throws Exception {
        when(jwtService.extractUsername("bad-token")).thenThrow(new JwtException("bad"));
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer bad-token");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("someone", null));

        filter.doFilter(request, new MockHttpServletResponse(), filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();

        when(jwtService.extractUsername("missing-user")).thenReturn("am.test9");
        when(userDetailsService.loadUserByUsername("am.test9"))
                .thenThrow(new UsernameNotFoundException("missing"));
        request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer missing-user");
        filter.doFilter(request, new MockHttpServletResponse(), filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(jwtService, never()).isTokenValid(eq("missing-user"), any());
    }
}
