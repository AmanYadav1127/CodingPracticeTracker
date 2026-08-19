package com.tracker.project.Controller;

import com.tracker.project.Model.User;
import com.tracker.project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email    = body.get("email");
        String password = body.get("password");

        if (username == null || username.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        if (email == null || email.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        if (password == null || password.length() < 6)
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
        if (userRepository.existsByUsername(username))
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        if (userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Account created successfully", "username", username));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        String identifier = body.get("identifier"); // username or email
        String password   = body.get("password");

        if (identifier == null || identifier.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Username or email is required"));
        if (password == null || password.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));

        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) userOpt = userRepository.findByEmail(identifier);

        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password))
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));

        User user = userOpt.get();
        return ResponseEntity.ok(Map.of("message", "Login successful", "username", user.getUsername(), "email", user.getEmail()));
    }
}
